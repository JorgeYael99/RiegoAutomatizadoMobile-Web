import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext"; // 👈 Importamos el hook del carrito
import { FiShoppingCart } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar() {
  const { token, rol, logout } = useAuth();
  const { cart } = useCart(); // 👈 Obtenemos el carrito

  // Verificación estricta del token
  const isAuthenticated = token && typeof token === 'string' && token.length > 0 && token !== "null" && token !== "undefined";

  // Calcular el total de items sumando las cantidades
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <h2 className="logo">🌱 HuertoSmart</h2>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/about">Nosotros</Link>

        {/* Carrito: visible solo si está autenticado */}
        {isAuthenticated && (
          <Link to="/cart" className="cart-link">
            <FiShoppingCart className="cart-icon" />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        )}

        {/* Login/Register si no autenticado */}
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

        {/* Admin si es admin */}
        {isAuthenticated && rol === "admin" && (
          <Link to="/admin" className="btn-admin">
            Admin
          </Link>
        )}

        {/* Cerrar sesión */}
        {isAuthenticated && (
          <button onClick={logout} className="btn-logout">
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}