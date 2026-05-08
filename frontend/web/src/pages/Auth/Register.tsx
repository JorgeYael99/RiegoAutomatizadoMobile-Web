import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getCaptcha, register as registerAPI } from "../../api/auth";
import "./Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [registrationSent, setRegistrationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadCaptcha = async () => {
    const response = await getCaptcha();
    setCaptchaQuestion(response.data.question);
    setCaptchaToken(response.data.token);
    setCaptchaAnswer("");
  };

  useEffect(() => {
    loadCaptcha().catch(() => {
      alert("No se pudo cargar el captcha");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerAPI({
        nombre: "Usuario",
        email,
        password,
        captchaToken,
        captchaAnswer,
      });
      setRegistrationSent(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.msg
        : null;
      alert(message || "Error al registrarse. Revisa el captcha o intenta con otro correo.");
      loadCaptcha().catch(() => undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page fade-up">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{registrationSent ? "Verificar correo" : "Crear cuenta"}</h2>

        {!registrationSent ? (
          <>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="captcha-row">
              <span>{captchaQuestion || "Cargando..."}</span>
              <input
                type="number"
                placeholder="Resultado"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <p className="auth-help">
            Enviamos un enlace de confirmacion a {email}. Abre ese correo para
            activar tu cuenta.
          </p>
        )}

        <button type="submit" disabled={isLoading || registrationSent}>
          {isLoading ? "Enviando..." : registrationSent ? "Correo enviado" : "Registrarse"}
        </button>

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
