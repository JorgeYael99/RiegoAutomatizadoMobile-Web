import json
import urllib.parse
import urllib.request

from flask import Blueprint, request, jsonify
from models.contact_model import ContactMessage
from flask_jwt_extended import jwt_required, get_jwt
import config

contact_bp = Blueprint("contact", __name__)


def verify_recaptcha(captcha_token):
    if not config.RECAPTCHA_SECRET_KEY:
        print("RECAPTCHA_SECRET_KEY no está configurada")
        return False

    payload = urllib.parse.urlencode({
        "secret": config.RECAPTCHA_SECRET_KEY,
        "response": captcha_token
    }).encode()

    req = urllib.request.Request(
        "https://www.google.com/recaptcha/api/siteverify",
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=8) as response:
        result = json.loads(response.read().decode("utf-8"))

    return bool(result.get("success"))


# 🔹 Enviar mensaje de contacto (PÚBLICO - sin autenticación)
@contact_bp.route("", methods=["POST"])
def send_message():
    try:
        data = request.get_json(silent=True)
        
        if not data:
            return jsonify({"error": "JSON inválido o vacío"}), 400

        captcha_token = data.get("captchaToken")
        if not captcha_token or not verify_recaptcha(captcha_token):
            return jsonify({"error": "Captcha inválido"}), 400
        
        # Validar campos obligatorios
        required_fields = ["nombre", "email", "asunto", "mensaje"]
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({"error": f"El campo '{field}' es obligatorio"}), 400
        
        # Extraer y limpiar datos
        nombre = str(data["nombre"]).strip()
        email = str(data["email"]).strip()
        asunto = str(data["asunto"]).strip()
        mensaje = str(data["mensaje"]).strip()
        
        # Validar asunto permitido
        asuntos_permitidos = ["problema-producto", "duda-general", "colaboracion"]
        if asunto not in asuntos_permitidos:
            return jsonify({"error": "Asunto no válido"}), 400
        
        # Crear mensaje
        message_id = ContactMessage.create(nombre, email, asunto, mensaje)
        
        return jsonify({
            "message": "Mensaje enviado correctamente",
            "id": message_id
        }), 201
        
    except Exception as e:
        print("ERROR sending message:", e)
        return jsonify({"error": "Error interno del servidor"}), 500
# 🔹 Obtener todos los mensajes (SOLO ADMIN)
@contact_bp.route("", methods=["GET"])
@jwt_required()
def get_messages():
    try:
        claims = get_jwt()
        
        # Verificar rol admin
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        messages = ContactMessage.get_all()
        return jsonify(messages), 200
        
    except Exception as e:
        print("ERROR getting messages:", e)
        return jsonify({"error": "Error obteniendo mensajes"}), 500
# 🔹 Obtener contador de mensajes no leídos (SOLO ADMIN)
@contact_bp.route("/unread-count", methods=["GET"])
@jwt_required()
def get_unread_count():
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        count = ContactMessage.get_unread_count()
        return jsonify({"unread_count": count}), 200
        
    except Exception as e:
        print("ERROR getting unread count:", e)
        return jsonify({"error": "Error obteniendo contador"}), 500
# 🔹 Marcar mensaje como leído (SOLO ADMIN)
@contact_bp.route("/<int:message_id>/read", methods=["PUT"])
@jwt_required()
def mark_read(message_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        success = ContactMessage.mark_as_read(message_id)
        
        if not success:
            return jsonify({"error": "Mensaje no encontrado"}), 404
        
        return jsonify({"message": "Mensaje marcado como leído"}), 200
        
    except Exception as e:
        print("ERROR marking as read:", e)
        return jsonify({"error": "Error actualizando mensaje"}), 500
# 🔹 Marcar mensaje como no leído (SOLO ADMIN)
@contact_bp.route("/<int:message_id>/unread", methods=["PUT"])
@jwt_required()
def mark_unread(message_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        success = ContactMessage.mark_as_unread(message_id)
        
        if not success:
            return jsonify({"error": "Mensaje no encontrado"}), 404
        
        return jsonify({"message": "Mensaje marcado como no leído"}), 200
        
    except Exception as e:
        print("ERROR marking as unread:", e)
        return jsonify({"error": "Error actualizando mensaje"}), 500
# 🔹 Eliminar mensaje (SOLO ADMIN)
@contact_bp.route("/<int:message_id>", methods=["DELETE"])
@jwt_required()
def delete_message(message_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        success = ContactMessage.delete(message_id)
        
        if not success:
            return jsonify({"error": "Mensaje no encontrado"}), 404
        
        return jsonify({"message": "Mensaje eliminado correctamente"}), 200
        
    except Exception as e:
        print("ERROR deleting message:", e)
        return jsonify({"error": "Error eliminando mensaje"}), 500
# 🔹 Limpiar mensajes antiguos (SOLO ADMIN - puede llamarse manualmente)
@contact_bp.route("/cleanup", methods=["POST"])
@jwt_required()
def cleanup_old_messages():
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        deleted = ContactMessage.delete_old_messages(days=15)
        
        return jsonify({
            "message": f"Se eliminaron {deleted} mensajes antiguos",
            "deleted_count": deleted
        }), 200
        
    except Exception as e:
        print("ERROR cleaning up:", e)
        return jsonify({"error": "Error en limpieza"}), 500
