from random import randint
import secrets
from urllib.parse import urlencode

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import generate_password_hash
import config
from models.login_verification_model import LoginVerification
from models.registration_verification_model import RegistrationVerification
from models.user_model import User
from services.email_service import send_login_confirmation, send_registration_confirmation

auth = Blueprint("auth", __name__)


def get_captcha_serializer():
    return URLSafeTimedSerializer(current_app.config["JWT_SECRET_KEY"], salt="login-captcha")


def validate_captcha(captcha_token, captcha_answer):
    if not captcha_token or captcha_answer is None:
        return False

    try:
        payload = get_captcha_serializer().loads(captcha_token, max_age=600)
    except (BadSignature, SignatureExpired):
        return False

    return str(payload.get("answer")) == str(captcha_answer).strip()


@auth.route("/captcha", methods=["GET"])
def captcha():
    left = randint(2, 12)
    right = randint(2, 12)
    token = get_captcha_serializer().dumps({"answer": left + right})

    return jsonify(question=f"{left} + {right}", token=token)

@auth.route("/register", methods=["POST"])
def register():
    data = request.json

    if not validate_captcha(data.get("captchaToken"), data.get("captchaAnswer")):
        return jsonify(msg="Captcha incorrecto o expirado"), 400

    if User.get_by_email(data["email"]):
        return jsonify(msg="El usuario ya existe"), 400

    code = f"{secrets.randbelow(900000) + 100000}"
    session_id = secrets.token_urlsafe(32)
    password_hash = generate_password_hash(data["password"])

    RegistrationVerification.create(
        session_id,
        data.get("nombre") or "Usuario",
        data["email"],
        password_hash,
        code,
    )
    confirmation_url = (
        f"{config.FRONTEND_URL.rstrip('/')}/verify-register?"
        f"{urlencode({'session': session_id, 'code': code})}"
    )
    send_registration_confirmation(data["email"], confirmation_url)

    return jsonify(
        requiresEmailVerification=True,
        registrationSession=session_id,
        msg="Enlace de confirmacion enviado al correo"
    ), 201


@auth.route("/verify-register", methods=["POST"])
def verify_register():
    data = request.json
    verification = RegistrationVerification.verify(
        data.get("registrationSession"),
        data.get("code", ""),
    )

    if not verification:
        return jsonify(msg="Codigo invalido o expirado"), 401

    if User.get_by_email(verification["email"]):
        return jsonify(msg="El usuario ya existe"), 400

    User.create_with_hash(
        verification["nombre"],
        verification["email"],
        verification["password_hash"],
    )

    return jsonify(msg="Correo confirmado. Usuario creado correctamente")


@auth.route("/login", methods=["POST"])
def login():
    data = request.json

    if not validate_captcha(data.get("captchaToken"), data.get("captchaAnswer")):
        return jsonify(msg="Captcha incorrecto o expirado"), 400

    user = User.get_by_email(data["email"])

    if not user or not User.verify_password(data["password"], user["password_hash"]):
        return jsonify(msg="Credenciales incorrectas"), 401

    code = f"{secrets.randbelow(900000) + 100000}"
    session_id = secrets.token_urlsafe(32)

    LoginVerification.create(session_id, user["id"], code)
    confirmation_url = (
        f"{config.FRONTEND_URL.rstrip('/')}/verify-login?"
        f"{urlencode({'session': session_id, 'code': code})}"
    )
    send_login_confirmation(user["email"], confirmation_url)

    return jsonify(
        requiresEmailVerification=True,
        loginSession=session_id,
        msg="Enlace de confirmacion enviado al correo"
    )


@auth.route("/verify-email-code", methods=["POST"])
def verify_email_code():
    data = request.json
    verification = LoginVerification.verify(data.get("loginSession"), data.get("code", ""))

    if not verification:
        return jsonify(msg="Codigo invalido o expirado"), 401

    token = create_access_token(
        identity=str(verification["user_id"]),
        additional_claims={
            "rol": verification["rol"],
            "nombre": verification["nombre"],
        }
    )

    user_nombre = verification.get("nombre") or "Usuario"
    return jsonify(token=token, nombre=user_nombre)
