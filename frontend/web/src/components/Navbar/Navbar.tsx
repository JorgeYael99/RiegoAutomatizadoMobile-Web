import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext"; // <-- NUEVO
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { token, rol, logout } = useAuth();
  const { cart } = useCart(); // <-- NUEVO: obtener carrito
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated =
    token &&
    typeof token === "string" &&
    token.length > 0 &&
    token !== "null" &&
    token !== "undefined";

  const isAdmin = isAuthenticated && rol === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Calcular total de items (suma de cantidades) // <-- NUEVO
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Si es admin, mostrar navbar minimalista
  if (isAdmin) {
    return (
      <nav className="navbar admin-navbar">
        <Link to="/" className="logo">🌱 HuertoSmart</Link>
        
        <div className="admin-nav-links">
          <Link to="/admin" className="btn-admin">
            Admin
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      </nav>
    );
  }

  // Navbar normal para clientes o no autenticados
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
            {cartItemCount > 0 && ( // <-- NUEVO: mostrar badge solo si hay items
              <span className="cart-badge">{cartItemCount}</span>
            )}
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