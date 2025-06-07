import os 
import uuid
import bcrypt 
import datetime 
import requests as external_requests   
from dotenv import load_dotenv
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS 
from flask_socketio import SocketIO, emit
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from pymongo import MongoClient
from bson.objectid import ObjectId
from google.oauth2 import id_token
from google.auth.transport import requests
from werkzeug.utils import secure_filename

# === CONFIGURAÇÃO INICIAL ===
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['JWT_SECRET_KEY'] = 'sua_chave_secreta' 
app.config['JWT_TOKEN_LOCATION'] = ['headers']  
jwt = JWTManager(app)

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# === CONEXÃO COM O BANCO DE DADOS ===
try:
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    usuarios_collection = db["usuarios"]
    sessions_collection = db["sessions"]
except Exception as e:
    print(f"Erro ao conectar ao MongoDB: {e}")
    exit()

# === FUNÇÕES UTILITÁRIAS ===
def gerar_token_de_sessao():
    return str(uuid.uuid4())

def verificar_token():
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return None, {'error': 'Token de autorização ausente ou inválido'}, 401
    
    session_token = token.split(' ')[1]
    session_data = sessions_collection.find_one({'session_token': session_token})
    
    if session_data:
        user_id = session_data['user_id']
        user = usuarios_collection.find_one({'_id': ObjectId(user_id)})
        return user, None, None
    return None, {'error': 'Sessão inválida'}, 401

# === SOCKET.IO ===
@socketio.on('message')
def handle_message(msg):
    print('Mensagem recebida:', msg)
    emit('message', msg, broadcast=True)

# === ROTAS DE USUÁRIOS ===
@app.route('/api/usuarios', methods=['GET', 'PUT'])
@jwt_required()

def get_usuarios():
    if request.method == 'GET':
        usuarios_data = list(usuarios_collection.find({}, {'_id': 0}))
        for usuario in usuarios_data:
            usuario.pop('senha', None)
        return jsonify(usuarios_data)

    elif request.method == 'PUT':
        user_id = get_jwt_identity()
        try:
            user_id = ObjectId(user_id)
        except:
            return jsonify({"error": "ID de usuário inválido"}), 400

        data = request.get_json()
        imagem_base64 = data.get('imagem')

        if not imagem_base64:
            return jsonify({"error": "Imagem não fornecida"}), 400

        result = usuarios_collection.update_one(
            {"_id": user_id},
            {"$set": {"profile_pic": imagem_base64}}
        )

        if result.modified_count == 1:
            return jsonify({"message": "Imagem atualizada com sucesso"}), 200
        else:
            return jsonify({"message": "Nenhuma modificação feita"}), 200
        
@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    ultimo_usuario = usuarios_collection.find_one({'id': {'$exists': True}}, sort=[('id', -1)])
    proximo_id = ultimo_usuario['id'] + 1 if ultimo_usuario else 1

    novo_usuario = { 
            'id': proximo_id, 
            'nome': nome, 
            'email': email, 
            'senha': senha
            
}
    usuarios_collection.insert_one(novo_usuario)
    return jsonify(novo_usuario), 201

@app.route('/api/usuarios/<int:user_id>', methods=['PUT'])
def atualizar_usuario(user_id):
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    
    if not nome or not email:
        return jsonify({'erro': 'Nome e email são obrigatórios para atualização.'}), 400

    resultado = usuarios_collection.update_one({'id': user_id}, {'$set': {'nome': nome, 'email': email}})
    if resultado.modified_count > 0:
        usuario_atualizado = usuarios_collection.find_one({'id': user_id}, {'_id': 0})
        return jsonify(usuario_atualizado)
    return jsonify({'erro': 'Usuário não encontrado'}), 404

@app.route('/api/usuarios/<int:user_id>', methods=['DELETE'])
def deletar_usuario(user_id):
    resultado = usuarios_collection.delete_one({'id': user_id})
    if resultado.deleted_count > 0:
        return jsonify({'mensagem': f'Usuário com ID {user_id} deletado com sucesso.'}), 200
    return jsonify({'erro': 'Usuário não encontrado'}), 404

# === LOGIN COM SENHA ===
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    usuario = usuarios_collection.find_one({'email': email})

    if not usuario:
        senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt())
        novo_usuario = {
            'email': email,
            'senha': senha_hash,
            'created_at': datetime.datetime.now()
        }
        result = usuarios_collection.insert_one(novo_usuario)
        user_id = result.inserted_id
    else:
        if not bcrypt.checkpw(senha.encode('utf-8'), usuario['senha']):
            return jsonify({'error': 'Senha incorreta'}), 401
        user_id = usuario['_id']

    session_token = gerar_token_de_sessao()
    sessions_collection.insert_one({
        'user_id': str(user_id),
        'session_token': session_token,
        'created_at': datetime.datetime.now()
    })

    return jsonify({
        'success': True,
        'session_token': session_token,
        'user': {
            'id': str(user_id),
            'email': email
        }
    }), 200

# === LOGIN COM GOOGLE ===
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
        session_token = gerar_token_de_sessao()

        if usuario_existente:
            usuarios_collection.update_one(
                {'google_id': google_user_id},
                {'$set': {'email': email, 'nome': name}}
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

        sessions_collection.insert_one({
            'user_id': str(user_id),
            'session_token': session_token,
            'created_at': datetime.datetime.now()
        })

        return jsonify({
            'success': True,
            'message': 'Login com Google bem-sucedido',
            'session_token': session_token,
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
        return jsonify({'error': f'Erro inesperado: {e}'}), 500
    
    
# === LOGIN COM O GITHUB ===

@app.route("/api/github/callback", methods=['POST'])
def github_login():
    data = request.get_json()
    access_token = data.get('token')

    if not access_token:
        return jsonify({'error': 'Token de acesso do GitHub não fornecido'}), 400

    try:
        # Obter dados do usuário a partir do token do GitHub
        github_api_url = "https://api.github.com/user"
        headers = {'Authorization': f'token {access_token}'}
        response = external_requests.get(github_api_url, headers=headers)

        if response.status_code != 200:
            return jsonify({'error': 'Falha ao obter dados do usuário do GitHub'}), 401

        github_user = response.json()
        github_id = github_user.get('id')
        email = github_user.get('email') or f'{github_id}@github.com'  # fallback se e-mail for privado
        nome = github_user.get('name') or github_user.get('login')
        profile_pic = github_user.get('avatar_url')
        username = github_user.get('login')

        usuario_existente = usuarios_collection.find_one({'github_id': github_id})
        session_token = gerar_token_de_sessao()

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

        sessions_collection.insert_one({
            'user_id': str(user_id),
            'session_token': session_token,
            'created_at': datetime.datetime.now()
        })

        return jsonify({
            'success': True,
            'message': 'Login com GitHub bem-sucedido',
            'session_token': session_token,
            'user': {
                'github_id': github_id,
                'email': email,
                'nome': nome,
                'username': username,
                'profile_pic': profile_pic,
                'created_at': datetime.datetime.now()
            }
        }), 200

    except Exception as e:
        return jsonify({'error': f'Erro ao processar login com GitHub: {e}'}), 500
    
    
@app.route("/auth/github/callback")
def github_callback():
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'Código de autorização não fornecido'}), 400

    # Troca o código pelo access_token
    token_response = external_requests.post(
        "https://github.com/login/oauth/access_token",
        headers={'Accept': 'application/json'},
        data={
            'client_id': GITHUB_CLIENT_ID,
            'client_secret': GITHUB_CLIENT_SECRET,
            'code': code
        }
    )

    token_json = token_response.json()
    access_token = token_json.get('access_token')

    if not access_token:
        return jsonify({'error': 'Não foi possível obter o access_token'}), 400

    # Pega dados do usuário no GitHub
    user_response = external_requests.post(
        "https://api.github.com/user",
        headers={'Authorization': f'token {access_token}'}
    )

    github_user = user_response.json()
    github_id = github_user.get('id')
    nome = github_user.get('name') or github_user.get('login')
    email = github_user.get('email') or f"{github_user.get('login')}@users.noreply.github.com"
    profile_pic = github_user.get('avatar_url')

    if not github_id:
        return jsonify({'error': 'Erro ao obter dados do usuário GitHub'}), 500

    # Verifica se já existe
    usuario_existente = usuarios_collection.find_one({'github_id': github_id})
    if usuario_existente:
        user_id = usuario_existente['_id']
        usuarios_collection.update_one(
            {'_id': user_id},
            {'$set': {'nome': nome, 'email': email, 'profile_pic': profile_pic}}
        )
    else:
        result = usuarios_collection.insert_one({
            'github_id': github_id,
            'nome': nome,
            'email': email,
            'profile_pic': profile_pic,
            'created_at': datetime.datetime.now()
        })
        user_id = result.inserted_id

    session_token = gerar_token_de_sessao()
    sessions_collection.insert_one({
        'user_id': str(user_id),
        'session_token': session_token,
        'created_at': datetime.datetime.now()
    })

    # Redireciona para o frontend com o token
    redirect_url = f"http://localhost:3000/github-success?token={session_token}"
    return redirect(redirect_url)

# === ROTAS DE PERFIL ===
@app.route('/api/user/me', methods=['GET'])
def get_me():
    user, error, status_code = verificar_token()
    if error:
        return jsonify(error), status_code

    return jsonify({
        'id': str(user['_id']),
        'nome': user.get('nome')
    }), 200

@app.route('/api/user/update', methods=['PUT'])
def update_user():
    user, error, status_code = verificar_token()
    if error:
        return jsonify(error), status_code

    data = request.get_json()
    update_data = {}

    nome = data.get('nome')
    if nome is not None:
        update_data['nome'] = nome

    if update_data:
        try:
            result = usuarios_collection.update_one({'_id': user['_id']}, {'$set': update_data})
            if result.modified_count > 0:
                updated_user = usuarios_collection.find_one({'_id': user['_id']})
                return jsonify({
                    'message': 'Informações atualizadas com sucesso!',
                    'user': {
                        'id': str(updated_user['_id']),
                        'nome': updated_user.get('nome')
                    }
                }), 200
            return jsonify({'message': 'Nenhuma informação foi alterada.'}), 200
        except Exception as e:
            return jsonify({'error': f'Erro ao atualizar o usuário: {e}'}), 500
    return jsonify({'message': 'Nenhuma informação para atualizar.'}), 200

@app.route('/api/user/profile-picture', methods=['PUT'])
def salvar_foto_perfil():
    user, error, status_code = verificar_token()
    print("Usuário autenticado?", user)
    if error:
        print("Erro na verificação do token:", error)
        return jsonify(error), status_code

    data = request.get_json()
    print("Payload recebido:", data)
    imagem_base64 = data.get('imagem')

    if not imagem_base64:
        print("Imagem não fornecida.")
        return jsonify({'error': 'Imagem não fornecida'}), 400

    try:
        usuarios_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'profile_pic': imagem_base64}}
        )
        print("Imagem atualizada com sucesso no Mongo.")
        return jsonify({'message': 'Imagem de perfil atualizada com sucesso!'}), 200
    except Exception as e:
        print("Erro ao atualizar imagem:", e)
        return jsonify({'error': f'Erro ao salvar imagem: {e}'}), 500
    
    
# === SOCKET.IO ====

# Conexões ativas por user_id
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

    # Envia a mensagem de volta ao remetente (útil para confirmar envio)
    emit('private_message', {
        'sender_id': sender_id,
        'receiver_id': receiver_id,
        'message': message,
        'me': True
    }, room=request.sid)

    # Envia a mensagem ao destinatário se ele estiver conectado
    receiver_sid = user_sid_map.get(receiver_id)
    if receiver_sid:
        emit('private_message', {
            'sender_id': sender_id,
            'receiver_id': receiver_id,
            'message': message,
            'me': False
        }, room=receiver_sid)

# === MUDAR FOTO DE PERIFL === 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/usuarios/atualizar-imagem', methods=['PUT'])
def atualizar_imagem():
    token = request.form.get('token')
    imagem = request.files.get('imagem')

    if not token or not imagem:
        return jsonify({'erro': 'Token e imagem são obrigatórios'}), 400

    usuario = verificar_token(token)  # função que decodifica o token
    if not usuario:
        return jsonify({'erro': 'Token inválido'}), 401

    if not allowed_file(imagem.filename):
        return jsonify({'erro': 'Formato de imagem inválido'}), 400

    filename = secure_filename(imagem.filename)
    caminho = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    imagem.save(caminho)

    usuarios_collection.update_one(
        {'_id': ObjectId(usuario['_id'])},
        {'$set': {'imagem': caminho}}
    )

    return jsonify({'mensagem': 'Imagem atualizada com sucesso'})


# === EXECUTAR APLICAÇÃO ===
if __name__ == '__main__':

    socketio.run(app, debug=True, host='0.0.0.0', port=5000)