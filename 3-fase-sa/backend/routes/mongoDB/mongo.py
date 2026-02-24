import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_NAME: os.getenv("DATABASE_NAME")
from pymongo import MongoClient
MONGO_URI: os.getenv("MONGO_URI")


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