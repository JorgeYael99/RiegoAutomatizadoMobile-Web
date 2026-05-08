from email.message import EmailMessage
import smtplib

import config


class EmailConfigurationError(RuntimeError):
    pass


def _validate_smtp_config():
    if not config.SMTP_HOST or not config.SMTP_FROM:
        raise EmailConfigurationError(
            "SMTP no esta configurado. Define SMTP_HOST, SMTP_FROM, SMTP_USER y SMTP_PASSWORD."
        )


def send_email(to_email, subject, body, reply_to=None):
    _validate_smtp_config()

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = config.SMTP_FROM
    message["To"] = to_email
    if reply_to:
        message["Reply-To"] = reply_to
    message.set_content(body)

    with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as server:
        if config.SMTP_USE_TLS:
            server.starttls()
        if config.SMTP_USER and config.SMTP_PASSWORD:
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
        server.send_message(message)


def send_login_confirmation(email, confirmation_url):
    subject = "Confirma tu inicio de sesion"
    body = (
        "Confirma que eres tu para completar el inicio de sesion en HuertoSmart:\n\n"
        f"{confirmation_url}\n\n"
        "El enlace vence en 10 minutos y solo se puede usar una vez. "
        "Si no intentaste iniciar sesion, ignora este mensaje."
    )
    send_email(email, subject, body)


def send_registration_confirmation(email, confirmation_url):
    subject = "Confirma tu registro"
    body = (
        "Confirma tu correo para completar tu registro en HuertoSmart:\n\n"
        f"{confirmation_url}\n\n"
        "El enlace vence en 30 minutos y solo se puede usar una vez. "
        "Si no solicitaste esta cuenta, ignora este mensaje."
    )
    send_email(email, subject, body)


def send_contact_notification(nombre, email, asunto, mensaje):
    if not config.CONTACT_RECIPIENT_EMAIL:
        raise EmailConfigurationError("CONTACT_RECIPIENT_EMAIL no esta configurado.")

    subject = f"Nuevo mensaje de contacto: {asunto}"
    body = (
        "Recibiste un nuevo mensaje desde el formulario de contacto de HuertoSmart.\n\n"
        f"Nombre: {nombre}\n"
        f"Correo: {email}\n"
        f"Asunto: {asunto}\n\n"
        f"Mensaje:\n{mensaje}"
    )
    send_email(config.CONTACT_RECIPIENT_EMAIL, subject, body, reply_to=email)
