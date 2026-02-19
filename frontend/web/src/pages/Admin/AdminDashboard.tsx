import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";
import {
  getContactMessages,
  getUnreadMessagesCount,
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,
} from "../../api/contact";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

interface ContactMessage {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export default function Admin() {
  const { token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  // Estados para mensajes
  const [activeView, setActiveView] = useState<"dashboard" | "messages">("dashboard");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const API_URL = "https://riego-automatizado-mobile-web.vercel.app/api/products";

  // 🔹 Obtener productos
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  // 🔹 Obtener mensajes
  const fetchMessages = async () => {
    try {
      const response = await getContactMessages();
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // 🔹 Obtener contador de no leídos
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadMessagesCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Polling cada 30 segundos para el badge
  useEffect(() => {
    fetchProducts();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Cargar mensajes cuando se cambia a la vista de mensajes
  useEffect(() => {
    if (activeView === "messages") {
      fetchMessages();
    }
  }, [activeView]);

  // 🔹 Crear producto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        image: form.image,
      }),
    });

    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      stock: "",
    });

    setShowModal(false);
    fetchProducts();
  };

  // 🔹 Eliminar producto
  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
  };

  // 🔹 Abrir mensaje y marcar como leído
  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setShowMessageModal(true);

    if (!msg.leido) {
      try {
        await markMessageAsRead(msg.id);
        fetchMessages();
        fetchUnreadCount();
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  // 🔹 Toggle leído/no leído
  const toggleRead = async (id: number, read: boolean) => {
    try {
      if (read) {
        await markMessageAsRead(id);
      } else {
        await markMessageAsUnread(id);
      }
      fetchMessages();
      fetchUnreadCount();
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  // 🔹 Eliminar mensaje
  const handleDeleteMessage = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este mensaje?")) {
      try {
        await deleteMessage(id);
        fetchMessages();
        fetchUnreadCount();
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  // Traducir asunto para mostrar
  const translateAsunto = (asunto: string) => {
    const translations: { [key: string]: string } = {
      "problema-producto": "Problema con producto",
      "duda-general": "Duda general",
    };
    return translations[asunto] || asunto;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={activeView === "dashboard" ? "active" : ""}
            onClick={() => setActiveView("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeView === "messages" ? "active" : ""}
            onClick={() => setActiveView("messages")}
          >
            Mensajes
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </li>
          <li>Productos</li>
          <li>Usuarios</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* VISTA DASHBOARD */}
        {activeView === "dashboard" && (
          <>
            <div className="admin-header">
              <h1>Dashboard</h1>
              <button
                className="primary-btn"
                onClick={() => setShowModal(true)}
              >
                + Nuevo Producto
              </button>
            </div>

            {/* Stats */}
            <div className="admin-stats">
              <div className="stat-card">
                <h3>Total Productos</h3>
                <p>{products.length}</p>
              </div>

              <div className="stat-card">
                <h3>Stock Total</h3>
                <p>{products.reduce((acc, p) => acc + p.stock, 0)}</p>
              </div>

              <div className="stat-card">
                <h3>Valor Inventario</h3>
                <p>
                  ${products
                    .reduce((acc, p) => acc + p.price * p.stock, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>

            {/* Table */}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.image && <img src={p.image} alt={p.name} />}</td>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (
                            confirm(
                              "¿Seguro que quieres eliminar este producto?"
                            )
                          ) {
                            handleDelete(p.id);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* VISTA MENSAJES */}
        {activeView === "messages" && (
          <>
            <div className="admin-header">
              <h1>Mensajes de Contacto</h1>
            </div>

            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No hay mensajes de contacto.</p>
              </div>
            ) : (
              <table className="admin-table messages-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Asunto</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={msg.leido ? "" : "unread-row"}
                    >
                      <td>
                        <span className={`status-icon ${msg.leido ? "read" : "unread"}`}>
                          {msg.leido ? "👁️" : "🔴"}
                        </span>
                      </td>
                      <td>{msg.nombre}</td>
                      <td>{msg.email}</td>
                      <td>{translateAsunto(msg.asunto)}</td>
                      <td>
                        {new Date(msg.created_at).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => openMessage(msg)}
                        >
                          Ver
                        </button>
                        <button
                          className={`toggle-btn ${msg.leido ? "unread-action" : "read-action"}`}
                          onClick={() => toggleRead(msg.id, !msg.leido)}
                        >
                          {msg.leido ? "No leído" : "Leído"}
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* MODAL PRODUCTO */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Crear Nuevo Producto</h2>

              <form className="modal-form" onSubmit={handleSubmit}>
                <input
                  placeholder="Nombre"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Precio"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  required
                />

                <input
                  placeholder="URL Imagen"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: e.target.value,
                    })
                  }
                  required
                />

                <textarea
                  placeholder="Descripción"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  required
                />

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="primary-btn">
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL MENSAJE */}
        {showMessageModal && selectedMessage && (
          <div
            className="modal-overlay"
            onClick={() => setShowMessageModal(false)}
          >
            <div
              className="modal-content message-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Mensaje de {selectedMessage.nombre}</h2>

              <div className="message-details">
                <p>
                  <strong>Email:</strong> {selectedMessage.email}
                </p>
                <p>
                  <strong>Asunto:</strong> {translateAsunto(selectedMessage.asunto)}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(selectedMessage.created_at).toLocaleString("es-ES")}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {selectedMessage.leido ? "Leído" : "No leído"}
                </p>
              </div>

              <hr />

              <div className="message-content">
                <h4>Mensaje:</h4>
                <p>{selectedMessage.mensaje}</p>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
