import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { token, rol, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated =
    token &&
    typeof token === "string" &&
    token.length > 0 &&
    token !== "null" &&
    token !== "undefined";

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isAdminRoute) {
    return (
      <nav className="navbar admin-navbar">
        <Link to="/" className="logo">🌱 HuertoSmart</Link>
        
        <div className="admin-nav-links">
          {isAuthenticated && rol === "admin" && (
            <>
              <Link to="/admin" className="btn-admin">
                Admin
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <h2 className="logo">🌱 HuertoSmart</h2>

      {/* Botón hamburguesa */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/products" onClick={() => setMenuOpen(false)}>Productos</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>Nosotros</Link>
        <Link to="/Contact" onClick={() => setMenuOpen(false)}>Contacto</Link>

        {isAuthenticated && (
          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            <FiShoppingCart className="cart-icon" />
          </Link>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>
              Registrarse
            </Link>
          </>
        )}

        {isAuthenticated && rol === "admin" && (
          <Link to="/admin" className="btn-admin" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
        )}

        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
              navigate("/");
            }}
            className="btn-logout"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}