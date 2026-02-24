import os
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests
from flask import Flask, request, jsonify, send_from_directory

load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")