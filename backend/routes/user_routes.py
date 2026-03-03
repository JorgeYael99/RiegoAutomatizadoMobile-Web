from flask import Blueprint, request, jsonify
from models.user_model import User
from flask_jwt_extended import jwt_required, get_jwt

user_bp = Blueprint("users", __name__)

@user_bp.route("", methods=["GET"])
@jwt_required()
def get_users():
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        users = User.get_all()
        return jsonify(users), 200
        
    except Exception as e:
        print("ERROR getting users:", e)
        return jsonify({"error": "Error obteniendo usuarios"}), 500


@user_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify(user), 200
        
    except Exception as e:
        print("ERROR getting user:", e)
        return jsonify({"error": "Error obteniendo usuario"}), 500


@user_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        data = request.get_json(silent=True)
        
        if not data:
            return jsonify({"error": "JSON inválido"}), 400
        
        nombre = data.get("nombre", "").strip()
        email = data.get("email", "").strip()
        
        if not nombre or not email:
            return jsonify({"error": "Nombre y email son obligatorios"}), 400
        
        success = User.update(user_id, nombre, email)
        
        if not success:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify({"message": "Usuario actualizado correctamente"}), 200
        
    except Exception as e:
        print("ERROR updating user:", e)
        return jsonify({"error": "Error actualizando usuario"}), 500


@user_bp.route("/<int:user_id>/role", methods=["PUT"])
@jwt_required()
def update_user_role(user_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        data = request.get_json(silent=True)
        
        if not data:
            return jsonify({"error": "JSON inválido"}), 400
        
        rol = data.get("rol", "").strip()
        
        if rol not in ["admin", "cliente"]:
            return jsonify({"error": "Rol inválido. Debe ser 'admin' o 'cliente'"}), 400
        
        success = User.update_rol(user_id, rol)
        
        if not success:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        return jsonify({"message": "Rol actualizado correctamente"}), 200
        
    except Exception as e:
        print("ERROR updating role:", e)
        return jsonify({"error": "Error actualizando rol"}), 500


@user_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    try:
        claims = get_jwt()
        
        if claims.get("rol") != "admin":
            return jsonify({"message": "No autorizado"}), 403
        
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        if user["rol"] == "admin":
            return jsonify({"error": "No puedes eliminar un administrador"}), 400
        
        success = User.delete(user_id)
        
        if not success:
            return jsonify({"error": "Error al eliminar usuario"}), 500
        
        return jsonify({"message": "Usuario eliminado correctamente"}), 200
        
    except Exception as e:
        print("ERROR deleting user:", e)
        return jsonify({"error": "Error eliminando usuario"}), 500
