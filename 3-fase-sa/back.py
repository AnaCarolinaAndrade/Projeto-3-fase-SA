from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

try:
    client = MongoClient(MONGO_URI)
    db = client.get_database(DATABASE_NAME)
    usuarios_collection = db.get_collection("usuarios")
except Exception as e:
    print(f"Erro ao conectar ao MongoDB: {e}")
    exit()

@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    usuarios_data = list(usuarios_collection.find({}, {'_id': 0}))
    return jsonify(usuarios_data)

@app.route('/api/usuarios/<int:user_id>', methods=['GET'])
def get_usuario(user_id):
    usuario = usuarios_collection.find_one({'id': user_id}, {'_id': 0})
    if usuario:
        return jsonify(usuario)
    return jsonify({'erro': 'Usuário não encontrado'}), 404

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)