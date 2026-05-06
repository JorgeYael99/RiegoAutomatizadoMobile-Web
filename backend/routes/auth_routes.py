from random import randint
import secrets
from urllib.parse import urlencode

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
import config
from models.login_verification_model import LoginVerification
from models.user_model import User
from services.email_service import send_login_confirmation

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

    if User.get_by_email(data["email"]):
        return jsonify(msg="El usuario ya existe"), 400

    User.create(data["nombre"], data["email"], data["password"])

    return jsonify(msg="Usuario creado correctamente"), 201


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
        additional_claims={"rol": verification["rol"]}
    )

    return jsonify(token=token)
