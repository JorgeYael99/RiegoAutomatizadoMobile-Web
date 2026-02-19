from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth_routes import auth
from routes.product_routes import product_bp
from routes.contact_routes import contact_bp
import config
from database import get_db_connection
from config import GOOGLE_MAPS_API_KEY

#  Verificar conexión a DB
try:
    conn = get_db_connection()
    print("Conectado a MYSQL correctamente uwu")
    conn.close()
except Exception as e:
    print("Error de conexion:", e)

app = Flask(__name__)
@app.route('/api/maps-key', methods=['GET'])
def get_maps_key():
    return jsonify({"key": config.GOOGLE_MAPS_API_KEY})

app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY

jwt = JWTManager(app)

#  JWT ERROR HANDLERS REALES

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(" INVALID TOKEN:", error)
    return jsonify({"error": "Token inválido"}), 422


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(" TOKEN EXPIRADO")
    return jsonify({"error": "Token expirado"}), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    print(" TOKEN FALTANTE:", error)
    return jsonify({"error": "Token faltante"}), 401


@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    print(" TOKEN REVOCADO")
    return jsonify({"error": "Token revocado"}), 401


#  CORS correcto
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

#  Blueprints
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(product_bp, url_prefix="/api/products")
app.register_blueprint(contact_bp, url_prefix="/api/contact")

from models.contact_model import ContactMessage

try:
    deleted = ContactMessage.delete_old_messages(days=15)
    print(f"Auto-limpieza: {deleted} mensajes antiguos eliminados")
except Exception as e:
    print(f"Error en auto-limpieza: {e}")
    
if __name__ == "__main__":
    app.run(debug=True)
