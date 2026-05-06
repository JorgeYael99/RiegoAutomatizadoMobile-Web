import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import {
  getCaptcha,
  login as loginAPI,
} from "../../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [loginSession, setLoginSession] = useState("");
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
      const response = await loginAPI({
        email,
        password,
        captchaToken,
        captchaAnswer,
      });

      setLoginSession(response.data.loginSession);
    } catch (error) {
      console.error("Login error:", error);
      alert(
        loginSession
          ? "Revisa el enlace enviado a tu correo"
          : "Credenciales o captcha incorrectos, intente de nuevo"
      );
      if (!loginSession) {
        loadCaptcha().catch(() => undefined);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="auth-page fade-up">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{loginSession ? "Verificar correo" : "Iniciar sesión"}</h2>

        {!loginSession ? (
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
          <>
            <p className="auth-help">
              Enviamos un enlace de confirmacion a {email}. Abre ese correo
              para confirmar que eres tu y entrar a la pagina principal.
            </p>
          </>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Validando..." : loginSession ? "Enviar otro enlace" : "Entrar"}
        </button>

        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
