import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyRegister } from "../../api/auth";
import "./Auth.css";

export default function VerifyRegister() {
  const [status, setStatus] = useState("Confirmando tu registro...");
  const [hasError, setHasError] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const registrationSession = searchParams.get("session");
    const code = searchParams.get("code");

    if (!registrationSession || !code) {
      setHasError(true);
      setStatus("El enlace de confirmacion no es valido.");
      return;
    }

    verifyRegister({ registrationSession, code })
      .then(() => {
        setStatus("Tu correo fue confirmado. Ya puedes iniciar sesion.");
      })
      .catch(() => {
        setHasError(true);
        setStatus("El enlace expiro, ya fue usado o el correo ya esta registrado.");
      });
  }, [searchParams]);

  return (
    <div className="auth-page fade-up">
      <div className="auth-card">
        <h2>Verificacion de registro</h2>
        <p className="auth-help">{status}</p>
        <p>
          <Link to={hasError ? "/register" : "/login"}>
            {hasError ? "Volver a registrarse" : "Iniciar sesion"}
          </Link>
        </p>
      </div>
    </div>
  );
}
