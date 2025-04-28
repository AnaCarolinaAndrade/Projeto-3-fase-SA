from flask import Flask, request, jsonify
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from pymongo import MongoClient
from bson.objectid import ObjectId
from google.cloud import storage

# Inicializar o cliente do Google Cloud Storage
storage_client = storage.Client()

# Agora você pode interagir com o Google Cloud Storage, sem precisar especificar o caminho da chave diretamente
bucket = storage_client.get_bucket('your-bucket-name')

import os
import uuid
import datetime

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)

# Conexão com o MongoDB
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Inicializar o cliente do Google Cloud Storage
storage_client = storage.Client()

# Agora você pode interagir com o Google Cloud Storage, sem precisar especificar o caminho da chave diretamente
bucket = storage_client.get_bucket('your-bucket-name')

try:
    client = MongoClient(MONGO_URI)
    db = client.get_database(DATABASE_NAME)
    usuarios_collection = db.get_collection("usuarios")
    sessions_collection = db.get_collection("sessions")
except Exception as e:
    print(f"Erro ao conectar ao MongoDB: {e}")
    exit()

# Funções auxiliares
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
    else:
        return None, {'error': 'Sessão inválida'}, 401

# Rotas de Usuário
@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    usuarios_data = list(usuarios_collection.find({}, {'_id': 0}))
    return jsonify(usuarios_data)

@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    data = request.get_json()
    nome = data.get('nome')
    email = data.get('email')

    if not nome or not email:
        return jsonify({'erro': 'Nome e email são obrigatórios.'}), 400

    ultimo_usuario = usuarios_collection.find_one({}, sort=[('id', -1)])
    proximo_id = ultimo_usuario['id'] + 1 if ultimo_usuario else 1

    novo_usuario = {'id': proximo_id, 'nome': nome, 'email': email}
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

# Rotas de Perfil
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
            else:
                return jsonify({'message': 'Nenhuma informação foi alterada.'}), 200
        except Exception as e:
            return jsonify({'error': f'Erro ao atualizar o usuário: {e}'}), 500
    else:
        return jsonify({'message': 'Nenhuma informação para atualizar.'}), 200

# Executar aplicação
if __name__ == '__main__':
    app.run(debug=True, port=5000)
