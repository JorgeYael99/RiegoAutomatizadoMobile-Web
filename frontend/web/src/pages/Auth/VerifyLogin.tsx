import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmailCode } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function VerifyLogin() {
  const [status, setStatus] = useState("Confirmando tu inicio de sesion...");
  const [hasError, setHasError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const loginSession = searchParams.get("session");
    const code = searchParams.get("code");

    if (!loginSession || !code) {
      setHasError(true);
      setStatus("El enlace de confirmacion no es valido.");
      return;
    }

    verifyEmailCode({ loginSession, code })
      .then((response) => {
        login(response.data.token, response.data.nombre);
        navigate("/", { replace: true });
      })
      .catch(() => {
        setHasError(true);
        setStatus("El enlace expiro o ya fue usado. Inicia sesion de nuevo.");
      });
  }, [login, navigate, searchParams]);

  return (
    <div className="auth-page fade-up">
      <div className="auth-card">
        <h2>Verificacion de correo</h2>
        <p className="auth-help">{status}</p>
        {hasError && (
          <p>
            <Link to="/login">Volver a iniciar sesion</Link>
          </p>
        )}
      </div>
    </div>
  );
}
