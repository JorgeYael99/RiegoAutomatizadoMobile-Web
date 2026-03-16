# backend/routes/chatbot_routes.py
import os
from flask import Blueprint, request, jsonify
from google import genai  # <-- NUEVA LIBRERÍA
from dotenv import load_dotenv
import traceback

load_dotenv()

chatbot_bp = Blueprint('chatbot', __name__)

# --- Configuración con nueva librería ---
api_key = os.getenv("GEMINI_API_KEY")
print(f"🔑 API Key cargada: {'SÍ' if api_key else 'NO'}")

if not api_key:
    print("❌ ERROR: GEMINI_API_KEY no encontrada")
    client = None
else:
    try:
        # Inicializar el nuevo cliente
        client = genai.Client(api_key=api_key)
        
        # Probar con el modelo más económico
        test_response = client.models.generate_content(
            model='gemini-2.0-flash-lite',  # Modelo más ligero
            contents='responde solo OK'
        )
        print(f"✅ Cliente Gemini configurado correctamente")
        
    except Exception as e:
        print(f"❌ Error configurando Gemini: {e}")
        client = None
# --- Fin configuración ---

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        if client is None:
            return jsonify({'error': 'Chatbot no disponible - Problema con API key'}), 500

        data = request.get_json()
        if not data or not data.get('message'):
            return jsonify({'error': 'Mensaje requerido'}), 400

        user_message = data.get('message')
        print(f"📨 Mensaje: {user_message}")

        # Usar el modelo más económico para ahorrar cuota
        response = client.models.generate_content(
            model='gemini-2.0-flash-lite',  # Consume menos tokens
            contents=f"Eres asistente de Riego Automatizado (plantas). Responde breve: {user_message}"
        )

        return jsonify({'reply': response.text})

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': 'Error interno'}), 500