from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user_model import User

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    data = request.json

    if User.get_by_email(data["email"]):
        return jsonify(msg="El usuario ya existe"), 400

    User.create(data["nombre"], data["email"], data["password"])

    return jsonify(msg="Usuario creado correctamente"), 201


@auth.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.get_by_email(data["email"])

    if not user or not User.verify_password(data["password"], user["password_hash"]):
        return jsonify(msg="Credenciales incorrectas"), 401

    token = create_access_token(
        identity=str(user["id"]),
        additional_claims={"rol": user["rol"]}
    )

    return jsonify(token=token)
