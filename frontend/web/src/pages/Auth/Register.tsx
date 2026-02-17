import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerAPI } from "../../api/auth";
import "./Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await registerAPI({ nombre: "Usuario", email, password });
    navigate("/login");
  } catch (error) {
    alert("Error al registrarse");
  }
};

  return (
    <div className="auth-page fade-up">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>

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

        <button type="submit">Registrarse</button>

        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
