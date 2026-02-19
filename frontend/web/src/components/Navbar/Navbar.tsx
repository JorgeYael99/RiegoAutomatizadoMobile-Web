import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { token, rol, logout } = useAuth();

  return (
    <nav className="navbar">
      <h2 className="logo">🌱 HuertoSmart</h2>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/about">Nosotros</Link>
        <Link to="/cart">Carrito</Link>
        <Link to="/Contact">Contacto</Link>

        {!token && (
          <>
            <Link to="/login" className="btn-login">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-register">
              Registrarse
            </Link>
          </>
        )}

        {rol === "admin" && (
          <Link to="/admin" className="btn-admin">
            Admin
          </Link>
        )}

        {token && (
          <button onClick={logout} className="btn-logout">
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
