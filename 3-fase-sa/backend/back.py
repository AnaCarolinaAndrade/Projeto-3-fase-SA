# === IMPORTAÇÕES ===
import os # Biblioteca padrão para interagir com o sistema operacional (ex: ler variáveis de ambiente, caminhos, etc.)

import uuid # Gera identificadores únicos (UUIDs), útil para tokens, IDs de sessões, etc.

import bcrypt # Biblioteca para criptografar e verificar senhas de forma segura

import datetime # Manipulação de datas e horas (ex: gerar timestamps, datas de expiração)

from dotenv import load_dotenv # Carrega variáveis de ambiente do arquivo .env

from flask import Flask, request, jsonify # Framework principal do backend (Flask): cria rotas, lida com requisições/respostas

from flask_cors import CORS # Liberação de requisições entre domínios (CORS), necessário para frontend se comunicar com backend em outro domínio/porta

from flask_socketio import SocketIO, emit # Comunicação em tempo real com WebSocket (usado em chats, notificações ao vivo, etc.)

from pymongo import MongoClient # Conexão com banco de dados MongoDB

from bson.objectid import ObjectId # Permite trabalhar com IDs do MongoDB (ObjectId) de forma adequada no Python

from google.oauth2 import id_token # Verifica e decodifica tokens de autenticação do Google (ex: login com Google)

from google.auth.transport import requests # Transporta requisições para validação de tokens com os servidores do Google



# === CONFIGURAÇÃO INICIAL ===
load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

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
@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    usuarios_data = list(usuarios_collection.find({}, {'_id': 0}))
    for usuario in usuarios_data:
        usuario.pop('senha', None)
    return jsonify(usuarios_data)

@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')


    ultimo_usuario = usuarios_collection.find_one({'id': {'$exists': True}}, sort=[('id', -1)])
    proximo_id = ultimo_usuario['id'] + 1 if ultimo_usuario else 1

    novo_usuario = {'id': proximo_id, 'nome': nome, 'email': email, 'senha': senha}
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

    if not email or not senha:
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400

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
        family_name = idinfo.get('family_name')
        locale = idinfo.get('locale')

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
                'family_name': family_name,
                'locale': locale,
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
                'family_name': family_name,
                'locale': locale
            }
        }), 200

    except ValueError as e:
        return jsonify({'error': f'Token de ID do Google inválido: {e}'}), 401
    except Exception as e:
        return jsonify({'error': f'Erro inesperado: {e}'}), 500

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

# === EXECUTAR APLICAÇÃO ===
if __name__ == '__main__':

    socketio.run(app, debug=True, host='0.0.0.0', port=5000)