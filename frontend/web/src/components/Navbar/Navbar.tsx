import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiShoppingCart } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const { token, rol, logout } = useAuth();
  
  const isAuthenticated = token && typeof token === 'string' && token.length > 0 && token !== "null" && token !== "undefined";
  
  return (
    <nav className="navbar">
      <h2 className="logo">🌱 HuertoSmart</h2>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/about">Nosotros</Link>
        
        {isAuthenticated && (
          <Link to="/cart" className="cart-link">
            <FiShoppingCart className="cart-icon" />
          </Link>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn-login">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-register">
              Registrarse
            </Link>
          </>
        )}

        {isAuthenticated && rol === "admin" && (
          <Link to="/admin" className="btn-admin">
            Admin
          </Link>
        )}

        {isAuthenticated && (
          <button onClick={logout} className="btn-logout">
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
