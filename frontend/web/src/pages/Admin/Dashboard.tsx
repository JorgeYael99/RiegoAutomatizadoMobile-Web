import { useEffect, useState } from "react";
import { FiPackage, FiDollarSign, FiShoppingCart, FiUsers, FiMessageSquare } from "react-icons/fi";
import "./Dashboard.css";
import PageHeader from "./components/PageHeader";

interface Product {
  id: number;
  nombre: string;
  precio: number | string;
  stock: number;
  imagen_url: string;
}

interface User {
  id: number;
}

interface Order {
  id: number;
}

interface Message {
  id: number;
}

const API_PRODUCTS = "https://riego-automatizado-mobile-web.vercel.app/api/products";
const API_USERS = "https://riego-automatizado-mobile-web.vercel.app/api/users";
const API_ORDERS = "https://riego-automatizado-mobile-web.vercel.app/api/orders";
const API_CONTACT = "https://riego-automatizado-mobile-web.vercel.app/api/contact";

const parsePrice = (price: number | string | undefined): number => {
  if (price === undefined || price === null) return 0;
  return typeof price === 'number' ? price : parseFloat(price) || 0;
};

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [productsRes, usersRes, ordersRes, messagesRes] = await Promise.all([
        fetch(API_PRODUCTS).then(r => r.json()).catch(() => []),
        fetch(API_USERS, { headers }).then(r => r.json()).catch(() => []),
        fetch(API_ORDERS, { headers }).then(r => r.json()).catch(() => []),
        fetch(API_CONTACT, { headers }).then(r => r.json()).catch(() => [])
      ]);

      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setMessages(Array.isArray(messagesRes) ? messagesRes : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStock = products.reduce((acc, p) => acc + (parsePrice(p.stock) || 0), 0);
  const inventoryValue = products.reduce((acc, p) => acc + (parsePrice(p.precio) * parsePrice(p.stock)), 0);
  const totalOrders = orders.length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchData}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <PageHeader title="Dashboard" />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
            <FiPackage size={24} />
          </div>
          <h3>Productos</h3>
          <div className="value">{products.length}</div>
          <p className="stat-sub">{totalStock} unidades en stock</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <FiDollarSign size={24} />
          </div>
          <h3>Valor Inventario</h3>
          <div className="value">${inventoryValue.toFixed(2)}</div>
          <p className="stat-sub">Total en productos</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <FiShoppingCart size={24} />
          </div>
          <h3>Pedidos</h3>
          <div className="value">{totalOrders}</div>
          <p className="stat-sub">Total de órdenes</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e8ff", color: "#9333ea" }}>
            <FiUsers size={24} />
          </div>
          <h3>Usuarios</h3>
          <div className="value">{users.length}</div>
          <p className="stat-sub">Usuarios registrados</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Productos Recientes</h3>
          <div className="product-list">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="product-item">
                <img 
                  src={product.imagen_url || "https://via.placeholder.com/50"} 
                  alt={product.nombre}
                />
                <div className="product-info">
                  <span className="product-name">{product.nombre}</span>
                  <span className="product-price">${parsePrice(product.precio).toFixed(2)}</span>
                </div>
                <span className={`badge ${product.stock > 0 ? "badge-success" : "badge-danger"}`}>
                  {product.stock > 0 ? `${product.stock} uds` : "Agotado"}
                </span>
              </div>
            ))}
            {products.length === 0 && (
              <p className="empty-text">No hay productos</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3>Resumen</h3>
          <div className="summary-list">
            <div className="summary-item">
              <FiMessageSquare />
              <span>Mensajes de contacto</span>
              <strong>{messages.length}</strong>
            </div>
            <div className="summary-item">
              <FiShoppingCart />
              <span>Pedidos realizados</span>
              <strong>{totalOrders}</strong>
            </div>
            <div className="summary-item">
              <FiPackage />
              <span>Productos publicados</span>
              <strong>{products.length}</strong>
            </div>
            <div className="summary-item">
              <FiUsers />
              <span>Usuarios registrados</span>
              <strong>{users.length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
