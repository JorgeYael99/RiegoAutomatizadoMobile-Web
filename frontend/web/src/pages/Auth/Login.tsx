import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { useAuth } from "../../context/AuthContext";
import { login as loginAPI } from "../../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginAPI({ email, password });
      const token = response.data.token;
          
      login(token);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Credenciales incorrectas, intente de nuevo");
    }
  };


  return (
    <div className="auth-page fade-up">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

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

        <button type="submit">Entrar</button>

        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}