from email.message import EmailMessage
import smtplib

import config


def send_login_confirmation(email, confirmation_url):
    subject = "Confirma tu inicio de sesion"
    body = (
        "Confirma que eres tu para completar el inicio de sesion en HuertoSmart:\n\n"
        f"{confirmation_url}\n\n"
        "El enlace vence en 10 minutos y solo se puede usar una vez. "
        "Si no intentaste iniciar sesion, ignora este mensaje."
    )

    if not config.SMTP_HOST or not config.SMTP_FROM:
        print(f"Enlace de confirmacion para {email}: {confirmation_url}")
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = config.SMTP_FROM
    message["To"] = email
    message.set_content(body)

    with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as server:
        if config.SMTP_USE_TLS:
            server.starttls()
        if config.SMTP_USER and config.SMTP_PASSWORD:
            server.login(config.SMTP_USER, config.SMTP_PASSWORD)
        server.send_message(message)
