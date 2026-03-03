import { useEffect, useState } from "react";
import { FiPackage, FiDollarSign, FiShoppingCart, FiUsers, FiMessageSquare } from "react-icons/fi";

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
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

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

      <style>{`
        .dashboard {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #6b7280;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #dc2626;
          gap: 1rem;
        }

        .error-container button {
          padding: 0.5rem 1rem;
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #2e7d32;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .stat-card h3 {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .stat-card .value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-sub {
          font-size: 0.8rem;
          color: #9ca3af;
          margin: 0.25rem 0 0 0;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .product-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .product-item:hover {
          background: #f9fafb;
        }

        .product-item img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
        }

        .product-price {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .summary-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .summary-item svg {
          color: #6b7280;
        }

        .summary-item span {
          flex: 1;
          font-size: 0.9rem;
          color: #374151;
        }

        .summary-item strong {
          font-size: 1.1rem;
          color: #1e293b;
        }

        .empty-text {
          text-align: center;
          color: #9ca3af;
          padding: 1rem;
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
