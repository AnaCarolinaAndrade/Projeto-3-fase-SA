import os
import base64
import bcrypt
import datetime
import requests
from dotenv import load_dotenv
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import Flask, request, jsonify, send_from_directory

# === CONFIGURAÇÃO INICIAL ===
load_dotenv()
 
app = Flask(__name__)

# Configuração CORS: Permite requests do seu frontend React
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

socketio = SocketIO(app, cors_allowed_origins="*")
projetos = {
    1: {"titulo": "Projeto A", "descricao": "Primeiro projeto"},
    2: {"titulo": "Projeto B", "descricao": "Segundo projeto"},
}


MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

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
    usuarios_google_collection = db['usuarios_google']
    comentarios_collection = db['comentario']
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

@app.route('/api/login', methods=['POST'])
def login_usuario():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({'message': 'Email e senha são obrigatórios.'}), 400

    usuario = usuarios_collection.find_one({'email': email})
    print(f"Usuário encontrado no DB: {usuario}")

    if not usuario:
        return jsonify({'message': 'Email ou senha inválidos.'}), 401

    try:
        print(f"Senha do DB (hash): {usuario['senha']}") 
        print(f"Senha fornecida (plain): {senha}") 
        if not bcrypt.checkpw(senha.encode('utf-8'), usuario['senha'].encode('utf-8')):
            return jsonify({'message': 'Email ou senha inválidos.'}), 401
    except Exception as e:
        print(f"Erro na verificação de senha: {e}") 
        return jsonify({'message': 'Erro interno na verificação de senha.'}), 500

    user_id_str = str(usuario['_id'])
    
    return jsonify({
        'message': 'Login bem-sucedido!',
        'id': user_id_str
    }), 200


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

        usuario_existente = usuarios_google_collection.find_one({'google_id': google_user_id})

        if usuario_existente:
            usuarios_google_collection.update_one(
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

            result = usuarios_google_collection.insert_one(novo_usuario)
            user_id = result.inserted_id

        return jsonify({
            'success': True,
            'message': 'Login com Google bem-sucedido',
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
    
@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')
    dataNascimento = data.get('dataNascimento')

    if not nome or not email or not senha:
        return jsonify({'error': 'Nome, email e senha são obrigatórios'}), 400

    if usuarios_collection.find_one({'email': email}):
        return jsonify({'error': 'Email já cadastrado'}), 409

    hashed_password = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())

    novo_usuario = {
        'nome': nome,
        'email': email,
        'senha': hashed_password.decode('utf-8'),
        'dataNascimento': dataNascimento,
        'created_at': datetime.datetime.now(),
    }
    

    result = usuarios_collection.insert_one(novo_usuario)
    return jsonify({"message": "Usuário criado com sucesso", "id": str(result.inserted_id)}), 201

@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    usuarios_data = []
    for usuario in usuarios_collection.find({}, {'senha': 0}):
        usuario['_id'] = str(usuario['_id']) 
        usuarios_data.append(usuario)
    return jsonify(usuarios_data)


@app.route('/api/usuarios/<string:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    update_data = {}

    nome = data.get('nome')
    if nome is not None:
        update_data['nome'] = nome

    dataNascimento = data.get('dataNascimento')
    if dataNascimento is not None:
        update_data['dataNascimento'] = dataNascimento

    genero = data.get('genero')
    if genero is not None:
        update_data['genero'] = genero

    senha = data.get('senha')
    if senha is not None:
        hashed_password = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())
        update_data['senha'] = hashed_password.decode('utf-8')

    email = data.get('email')
    if email is not None:
        update_data['email'] = email

    localizacao = data.get('localizacao')
    if localizacao is not None:
        update_data['localizacao'] = localizacao

    bio = data.get('bio')
    if bio is not None:
        update_data['bio'] = bio

    imagemPerfil = data.get('imagemPerfil')
    if imagemPerfil is not None:
        update_data['imagemPerfil'] = imagemPerfil

    if update_data:
        try:
            result = usuarios_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )
            if result.matched_count == 0:
                return jsonify({'error': 'Usuário não encontrado'}), 404

            updated_user = usuarios_collection.find_one({'_id': ObjectId(user_id)})
            if updated_user:
                updated_user['_id'] = str(updated_user['_id'])
                updated_user.pop('senha', None)
                return jsonify({
                    'message': 'Informações atualizadas com sucesso!',
                    'usuario': updated_user
                }), 200
        except Exception as e:
            print(f"Erro ao atualizar o usuário: {e}")
            return jsonify({'error': f'Erro ao atualizar o usuário: {e}'}), 500

    return jsonify({'message': 'Nenhuma informação para atualizar.'}), 400

@app.route('/api/usuarios/<string:user_id>', methods=['GET'])
def get_usuario_by_id(user_id):
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "ID de usuário inválido."}), 400

    usuario = usuarios_collection.find_one({"_id": obj_id}, {"_id": 0})

    if usuario:
        return jsonify(usuario), 200
    else:
        return jsonify({"message": "Usuário não encontrado."}), 404


@app.route('/api/usuarios', methods=['DELETE'])
def deletar_proprio_usuario():
    try:
        resultado = usuarios_collection.delete_one({'_id': [1]})
        if resultado.deleted_count > 0:
            return jsonify({'mensagem': f'Usuário deletado com sucesso.'}), 200
        return jsonify({'erro': 'Usuário não encontrado'}), 404
    except Exception as e:
        print(f"Erro ao deletar usuário: {e}")
        return jsonify({'erro': 'Erro interno ao deletar usuário'}), 500

# === ROTAS DE PROJETOS ===

@app.route('/projetos/<int:id>', methods=['PUT'])
def editar_projeto(id):
    if id not in projetos:
        return jsonify({"erro": "Projeto não encontrado"}), 404

    dados = request.json
    titulo = dados.get("titulo")
    descricao = dados.get("descricao")

    if titulo:
        projetos[id]["titulo"] = titulo
    if descricao:
        projetos[id]["descricao"] = descricao

    return jsonify({"mensagem": "Projeto atualizado", "projeto": projetos[id]})

# Rota para deletar um projeto
@app.route('/projetos/<int:id>', methods=['DELETE'])
def deletar_projeto(id):
    if id not in projetos:
        return jsonify({"erro": "Projeto não encontrado"}), 404

    del projetos[id]
    return jsonify({"mensagem": f"Projeto {id} deletado com sucesso"})
    
@app.route('/api/criar_projetos', methods=['POST'])
def criar_projeto():
    nomeProjeto = request.form.get('nomeProjeto')
    descricao = request.form.get('descricao')
    categoria = request.form.get('categoria')
    imagem = request.files.get('imagem')

    if not nomeProjeto or not descricao:
        return jsonify({"success": False, "error": "Nome e descrição obrigatórios"}), 400

    imagem_url = ""
    if imagem:
        filename = secure_filename(imagem.filename)
        path = os.path.join("static/uploads", filename)
        imagem.save(path)
        imagem_url = f"/static/uploads/{filename}"

    novo_projeto = {
        'nomeProjeto': nomeProjeto,
        'descricao': descricao,
        'imagem': imagem_url,
        'categoria': categoria,
        'created_at': datetime.datetime.now()
    }

    result = projetos_collection.insert_one(novo_projeto)

    return jsonify({
        "projeto": {
            "id": str(result.inserted_id),
            "nomeProjeto": nomeProjeto,
            "descricao": descricao,
            "imagem": imagem_url
        }
    }), 201
    
@app.route('/api/criar_projetos', methods=['GET'])
def listar_projetos():
    projetos = projetos_collection.find().sort("created_at", -1)
    lista = []
    for p in projetos:
        lista.append({
            "id": str(p["_id"]),
            "nomeProjeto": p.get("nomeProjeto", ""),
            "descricao": p.get("descricao", ""),
            "imagem": p.get("imagem", ""),
            "categoria": p.get("categoria", "")
        })
    return jsonify(lista), 200

@app.route('/api/projetos/<string:id_projeto>', methods=['GET'])
def get_projeto_by_id(id_projeto):
    try:
        # Tenta converter o ID para um ObjectId do MongoDB
        obj_id = ObjectId(id_projeto)
    except Exception:
        # Se o ID não for um ObjectId válido, retorne 400 Bad Request
        return jsonify({"error": "ID de projeto inválido."}), 400

    # Busca o projeto pelo _id
    projeto = projetos_collection.find_one({"_id": obj_id}, {"_id": 0}) # Exclui o _id da resposta para o frontend

    if projeto:
        return jsonify(projeto), 200
    else:
        # Se não encontrar o projeto, retorne 404 Not Found
        return jsonify({"message": "Projeto não encontrado."}), 404


# === CRIAÇÃO DE COMENTARIOS ==== # 
@app.route('/api/usarios/comentarios/<string:projeto_id>', methods=['POST'])
def criar_comentario(projeto_id):
    data = request.get_json()
    comentario = data.get('comentario')

    if not comentario:
        return jsonify({"error": "Comentario obrigatorio"}), 400

    novo_comentario = {
        'comentario': comentario,
        'created_at': datetime.datetime.now()
    }

    result = comentarios_collection.insert_one(novo_comentario)
    return jsonify({
        "success": True,
        "comentario": {
            **{k: v for k, v in novo_comentario.items() if k != '_id'}, 
            "id": str(result.inserted_id) 
        }
    }), 201

@app.route('/api/criar_projetos/<string:projeto_id>', methods=['PUT']) # Usar string para ObjectId
def atualizar_projeto(projeto_id):
    data = request.get_json()

    try:
        # Busca o projeto pelo _id do MongoDB e verifica se pertence ao usuário
        projeto_existente = projetos_collection.find_one({'_id': ObjectId(projeto_id)})

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
def deletar_projeto(projeto_id):
    try:
        # Deleta o projeto pelo _id do MongoDB e verifica se pertence ao usuário logado
        resultado = projetos_collection.delete_one({'_id': ObjectId(projeto_id)})
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
        


# === EXECUTAR APLICAÇÃO ===
if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)