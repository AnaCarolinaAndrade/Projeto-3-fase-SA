import os
import uuid
import bcrypt
import datetime
import requests as external_requests
from dotenv import load_dotenv
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from bson.objectid import ObjectId
from google.oauth2 import id_token
from google.auth.transport import requests
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, redirect, url_for, send_from_directory
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity, decode_token

# === CONFIGURAÇÃO INICIAL ===
load_dotenv()

app = Flask(__name__)

# Configuração CORS: Permite requests do seu frontend React
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

socketio = SocketIO(app, cors_allowed_origins="*")

# --- Configuração do JWT ---
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "sua_chave_secreta_padrao_muito_longa_e_segura")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET") # Ainda necessário se você usar o fluxo de callback no backend

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = 'static/uploads'
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# === CONEXÃO COM O BANCO DE DADOS ===
try:
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    usuarios_collection = db["usuarios"]
    projetos_collection = db['projetos']
    # Removido sessions_collection pois JWT será usado exclusivamente
    print("Conexão com MongoDB estabelecida com sucesso!")
except Exception as e:
    print(f"Erro ao conectar ao MongoDB: {e}")
    exit()

# === FUNÇÕES UTILITÁRIAS ===
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# === SOCKET.IO ===
@socketio.on('message')
def handle_message(msg):
    print('Mensagem recebida:', msg)
    emit('message', msg, broadcast=True)

# === ROTAS DE AUTENTICAÇÃO E USUÁRIOS ===

# Rota de Login (agora retorna JWT)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    usuario = usuarios_collection.find_one({'email': email})

    if not usuario:
        return jsonify({'error': 'Email ou senha incorretos'}), 401

    if not bcrypt.checkpw(senha.encode('utf-8'), usuario['senha'].encode('utf-8')):
        return jsonify({'error': 'Email ou senha incorretos'}), 401

    access_token = create_access_token(identity=str(usuario['_id']))
    return jsonify(access_token=access_token, user_id=str(usuario['_id'])), 200


# === LOGIN COM GOOGLE (API-BASED) ===
@app.route('/api/google-login', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'error': 'Token de ID do Google não fornecido'}), 400

    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Emissor inválido.')

        google_user_id = idinfo['sub']
        email = idinfo.get('email')
        name = idinfo.get('name')
        profile_pic = idinfo.get('picture')
        given_name = idinfo.get('given_name')

        usuario_existente = usuarios_collection.find_one({'google_id': google_user_id})

        if usuario_existente:
            usuarios_collection.update_one(
                {'google_id': google_user_id},
                {'$set': {'email': email, 'nome': name, 'profile_pic': profile_pic}}
            )
            user_id = usuario_existente['_id']
        else:
            novo_usuario = {
                'google_id': google_user_id,
                'email': email,
                'nome': name,
                'profile_pic': profile_pic,
                'given_name': given_name,
                'created_at': datetime.datetime.now()
            }
            result = usuarios_collection.insert_one(novo_usuario)
            user_id = result.inserted_id

        access_token = create_access_token(identity=str(user_id))

        return jsonify({
            'success': True,
            'message': 'Login com Google bem-sucedido',
            'access_token': access_token,
            'user': {
                'id': str(user_id),
                'google_id': google_user_id,
                'email': email,
                'nome': name,
                'profile_pic': profile_pic,
                'given_name': given_name,
            }
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Token de ID do Google inválido: {e}'}), 401
    except Exception as e:
        print(f"Erro inesperado no login com Google: {e}")
        return jsonify({'error': f'Erro inesperado: {e}'}), 500


# === LOGIN COM O GITHUB (API-BASED) ===
@app.route("/api/github-login", methods=['POST'])
def github_login():
    data = request.get_json()
    access_token = data.get('token')

    if not access_token:
        return jsonify({'error': 'Token de acesso do GitHub não fornecido'}), 400

    try:
        github_api_url = "https://api.github.com/user"
        headers = {'Authorization': f'token {access_token}'}
        response = external_requests.get(github_api_url, headers=headers)

        if response.status_code != 200:
            return jsonify({'error': f'Falha ao obter dados do usuário do GitHub: {response.text}'}), 401

        github_user = response.json()
        github_id = github_user.get('id')
        email = github_user.get('email')
        if not email:
            emails_response = external_requests.get("https://api.github.com/user/emails", headers=headers)
            if emails_response.status_code == 200:
                for mail_data in emails_response.json():
                    if mail_data.get('primary') and mail_data.get('verified') and not mail_data.get('visibility') == 'private':
                        email = mail_data.get('email')
                        break
            if not email:
                email = f'{github_user.get("login")}@users.noreply.github.com'

        nome = github_user.get('name') or github_user.get('login')
        profile_pic = github_user.get('avatar_url')
        username = github_user.get('login')

        if not github_id:
            return jsonify({'error': 'Erro ao obter ID do usuário GitHub'}), 500

        usuario_existente = usuarios_collection.find_one({'github_id': github_id})

        if usuario_existente:
            usuarios_collection.update_one(
                {'github_id': github_id},
                {'$set': {'email': email, 'nome': nome, 'profile_pic': profile_pic, 'username': username}}
            )
            user_id = usuario_existente['_id']
        else:
            novo_usuario = {
                'github_id': github_id,
                'email': email,
                'nome': nome,
                'username': username,
                'profile_pic': profile_pic,
                'created_at': datetime.datetime.now()
            }
            result = usuarios_collection.insert_one(novo_usuario)
            user_id = result.inserted_id

        access_token_jwt = create_access_token(identity=str(user_id))

        return jsonify({
            'success': True,
            'message': 'Login com GitHub bem-sucedido',
            'access_token': access_token_jwt,
            'user': {
                'id': str(user_id),
                'github_id': github_id,
                'email': email,
                'nome': nome,
                'username': username,
                'profile_pic': profile_pic,
            }
        }), 200

    except Exception as e:
        print(f"Erro no login com GitHub: {e}")
        return jsonify({'error': f'Erro ao processar login com GitHub: {e}'}), 500

# Removido o fluxo de callback do GitHub baseado em redirecionamento, use o fluxo API-based acima
# @app.route("/auth/github/callback")
# def github_callback():
#    ... (código removido) ...


# Rota de Criação de Usuário (agora com hashing de senha)
@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if not nome or not email or not senha:
        return jsonify({'error': 'Nome, email e senha são obrigatórios'}), 400

    if usuarios_collection.find_one({'email': email}):
        return jsonify({'error': 'Email já cadastrado'}), 409

    hashed_password = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

    novo_usuario = {
        'nome': nome,
        'email': email,
        'senha': hashed_password.decode('utf-8'),
        'created_at': datetime.datetime.now(),
        'profile_pic': None
    }

    result = usuarios_collection.insert_one(novo_usuario)
    return jsonify({"message": "Usuário criado com sucesso", "id": str(result.inserted_id)}), 201

# Rota para obter todos os usuários (agora protegida)
@app.route('/api/usuarios', methods=['GET'])
@jwt_required()
def get_usuarios():
    usuarios_data = []
    for usuario in usuarios_collection.find({}, {'senha': 0}): # Exclui senha
        usuario['_id'] = str(usuario['_id']) # Converte ObjectId para string
        usuarios_data.append(usuario)
    return jsonify(usuarios_data)

# Rota para obter detalhes do usuário logado
@app.route('/api/user/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = usuarios_collection.find_one({'_id': ObjectId(user_id)}, {'senha': 0}) # Exclui senha
    if user:
        user['_id'] = str(user['_id'])
        return jsonify(user), 200
    return jsonify({'error': 'Usuário não encontrado'}), 404

# Rota para atualizar informações do usuário logado (usando o _id do token)
@app.route('/api/user/update', methods=['PUT'])
@jwt_required()
def update_user():
    user_id = get_jwt_identity()
    data = request.get_json()
    update_data = {}

    nome = data.get('nome')
    if nome is not None:
        update_data['nome'] = nome

    nova_senha = data.get('senha')
    if nova_senha is not None:
        hashed_password = bcrypt.hashpw(nova_senha.encode('utf-8'), bcrypt.gensalt())
        update_data['senha'] = hashed_password.decode('utf-8')

    if update_data:
        try:
            result = usuarios_collection.update_one({'_id': ObjectId(user_id)}, {'$set': update_data})
            if result.modified_count > 0:
                updated_user = usuarios_collection.find_one({'_id': ObjectId(user_id)})
                if updated_user:
                    updated_user['_id'] = str(updated_user['_id'])
                    updated_user.pop('senha', None) # Não retorne a senha hashed
                return jsonify({
                    'message': 'Informações atualizadas com sucesso!',
                    'user': updated_user
                }), 200
            return jsonify({'message': 'Nenhuma informação foi alterada.'}), 200
        except Exception as e:
            print(f"Erro ao atualizar o usuário: {e}")
            return jsonify({'error': f'Erro ao atualizar o usuário: {e}'}), 500
    return jsonify({'message': 'Nenhuma informação para atualizar.'}), 200

# Rota para deletar o próprio usuário (protegida)
@app.route('/api/user/delete', methods=['DELETE'])
@jwt_required()
def deletar_proprio_usuario():
    user_id = get_jwt_identity()
    try:
        resultado = usuarios_collection.delete_one({'_id': ObjectId(user_id)})
        if resultado.deleted_count > 0:
            return jsonify({'mensagem': f'Usuário {user_id} deletado com sucesso.'}), 200
        return jsonify({'erro': 'Usuário não encontrado'}), 404
    except Exception as e:
        print(f"Erro ao deletar usuário: {e}")
        return jsonify({'erro': 'Erro interno ao deletar usuário'}), 500


# === ROTAS DE PROJETOS ===

@app.route('/api/projetos', methods=['POST'])
@jwt_required()
def criar_projeto():
    user_id = get_jwt_identity()
    data = request.get_json()
    nomeProjeto = data.get('nomeProjeto')
    descricao = data.get('descricao')
    imagem = data.get('imagem')
    categoria = data.get('categoria', 'outros')

    if not nomeProjeto or not descricao:
        return jsonify({"error": "Nome e descrição do projeto são obrigatórios"}), 400

    novo_projeto = {
        'nomeProjeto': nomeProjeto,
        'descricao': descricao,
        'imagem': imagem,
        'completo': False,
        'categoria': categoria,
        'user_id': user_id,
        'created_at': datetime.datetime.now()
    }

    result = projetos_collection.insert_one(novo_projeto)
    return jsonify({
        "success": True,
        "projeto": {
            **{k: v for k, v in novo_projeto.items() if k != '_id'}, # Exclui _id temporariamente
            "id": str(result.inserted_id) # Retorna o _id do MongoDB como 'id'
        }
    }), 201


@app.route('/api/projetos', methods=['GET'])
@jwt_required()
def get_projetos():
    user_id = get_jwt_identity()

    projetos_cursor = projetos_collection.find({'user_id': user_id}) # Busca apenas projetos do usuário logado

    projetos_lista = []
    for projeto in projetos_cursor:
        proj_dict = {k: v for k, v in projeto.items() if k != '_id'} # Remove _id original
        proj_dict['id'] = str(projeto['_id']) # Adiciona o _id como 'id' string para o frontend

        proj_dict['nomeProjeto'] = proj_dict.get('nomeProjeto', '')
        proj_dict['descricao'] = proj_dict.get('descricao', '')
        proj_dict['completo'] = proj_dict.get('completo', False)
        proj_dict['categoria'] = proj_dict.get('categoria', 'outros')

        # Remove a linha que criava 'text' duplicado
        # if 'text' not in proj_dict:
        #    proj_dict['text'] = proj_dict.get('descricao', '')

        projetos_lista.append(proj_dict)

    return jsonify({ "projetos": projetos_lista })


@app.route('/api/projetos/<string:projeto_id>', methods=['PUT']) # Usar string para ObjectId
@jwt_required()
def atualizar_projeto(projeto_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        # Busca o projeto pelo _id do MongoDB e verifica se pertence ao usuário
        projeto_existente = projetos_collection.find_one({'_id': ObjectId(projeto_id), 'user_id': user_id})

        if not projeto_existente:
            return jsonify({'error': 'Projeto não encontrado ou você não tem permissão para editá-lo'}), 404

        update_fields = {}
        if 'nomeProjeto' in data:
            update_fields['nomeProjeto'] = data['nomeProjeto']
        if 'descricao' in data:
            update_fields['descricao'] = data['descricao']
        if 'imagem' in data:
            update_fields['imagem'] = data['imagem']
        if 'completo' in data:
            update_fields['completo'] = data['completo']
        if 'categoria' in data:
            update_fields['categoria'] = data['categoria']

        if update_fields:
            result = projetos_collection.update_one(
                {'_id': ObjectId(projeto_id)},
                {'$set': update_fields}
            )
            if result.modified_count > 0:
                return jsonify({'message': 'Projeto atualizado com sucesso!'}), 200
            return jsonify({'message': 'Nenhuma alteração feita ou projeto não encontrado.'}), 200
        return jsonify({'error': 'Nenhum dado para atualizar fornecido.'}), 400
    except Exception as e:
        return jsonify({'error': f'ID de projeto inválido ou erro: {e}'}), 400

@app.route('/api/projetos/<string:projeto_id>', methods=['DELETE']) # Usar string para ObjectId
@jwt_required()
def deletar_projeto(projeto_id):
    user_id = get_jwt_identity()
    try:
        # Deleta o projeto pelo _id do MongoDB e verifica se pertence ao usuário logado
        resultado = projetos_collection.delete_one({'_id': ObjectId(projeto_id), 'user_id': user_id})
        if resultado.deleted_count > 0:
            return jsonify({'mensagem': 'Projeto deletado com sucesso.'}), 200
        return jsonify({'erro': 'Projeto não encontrado ou você não tem permissão para deletá-lo'}), 404
    except Exception as e:
        return jsonify({'error': f'ID de projeto inválido ou erro: {e}'}), 400


# === ROTA PARA SERVIR IMAGENS ESTÁTICAS ===
@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# === SOCKET.IO ROTAS ====
user_sid_map = {}

@socketio.on('connect')
def handle_connect():
    print('Novo cliente conectado:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    disconnected_user = None
    for uid, sid in user_sid_map.items():
        if sid == request.sid:
            disconnected_user = uid
            break
    if disconnected_user:
        del user_sid_map[disconnected_user]
        print(f"Usuário {disconnected_user} desconectado.")

@socketio.on('register')
def handle_register(data):
    user_id = data.get('user_id')
    if user_id:
        user_sid_map[user_id] = request.sid
        print(f"Usuário {user_id} registrado com SID {request.sid}")

@socketio.on('private_message')
def handle_private_message(data):
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    message = data.get('message')

    if not sender_id or not receiver_id or not message:
        return emit('error', {'error': 'Dados incompletos na mensagem.'})

    print(f"Mensagem de {sender_id} para {receiver_id}: {message}")

    emit('private_message', {
        'sender_id': sender_id,
        'receiver_id': receiver_id,
        'message': message,
        'me': True
    }, room=request.sid)

    receiver_sid = user_sid_map.get(receiver_id)
    if receiver_sid:
        emit('private_message', {
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'message': message,
            'me': False
        }, room=receiver_sid)


# === ROTA DE UPLOAD DE IMAGEM DE PERFIL ===
@app.route('/api/user/profile-picture-upload', methods=['PUT'])
@jwt_required()
def upload_profile_picture():
    user_id = get_jwt_identity()

    if 'imagem' not in request.files:
        return jsonify({'error': 'Nenhum arquivo de imagem enviado'}), 400

    imagem = request.files['imagem']

    if imagem.filename == '':
        return jsonify({'error': 'Nenhum arquivo de imagem selecionado'}), 400

    if imagem and allowed_file(imagem.filename):
        filename = secure_filename(imagem.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        caminho_salvar = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        imagem.save(caminho_salvar)

        image_url = f"/{app.config['UPLOAD_FOLDER']}/{unique_filename}"

        try:
            usuarios_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'profile_pic': image_url}}
            )
            return jsonify({'message': 'Imagem de perfil atualizada com sucesso!', 'profile_pic_url': image_url}), 200
        except Exception as e:
            print(f"Erro ao atualizar imagem no DB: {e}")
            return jsonify({'error': 'Erro ao salvar imagem no perfil'}), 500
    else:
        return jsonify({'error': 'Formato de arquivo não permitido'}), 400

# === EXECUTAR APLICAÇÃO ===
if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)