import { useEffect, useState } from "react";
import {
  FiSearch,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import "./Messages.css";
import {
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,
} from "../../api/contact";
import PageHeader from "./components/PageHeader";

interface ContactMessage {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        "https://riego-automatizado-mobile-web.vercel.app/api/contact",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markMessageAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMarkAsUnread = async (id: number) => {
    try {
      await markMessageAsUnread(id);
      fetchMessages();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    try {
      await deleteMessage(id);
      fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const translateAsunto = (asunto: string) => {
    const translations: { [key: string]: string } = {
      "problema-producto": "Problema con producto",
      "duda-general": "Duda general",
    };
    return translations[asunto] || asunto;
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = filter === "all" || (filter === "unread" && !msg.leido);
    const matchesSearch =
      msg.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.mensaje.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => !m.leido).length;

  if (loading) {
    return <div className="loading">Cargando mensajes...</div>;
  }

  return (
    <div className="messages-page">
      <PageHeader
        title={
          <>
            Mensajes de Contacto
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} nuevos</span>
            )}
          </>
        }
        actions={
          <button className="btn btn-secondary" onClick={fetchMessages}>
            <FiRefreshCw /> Actualizar
          </button>
        }
      />

      <div className="filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({messages.length})
          </button>
          <button
            className={`filter-tab ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            No leídos ({unreadCount})
          </button>
        </div>
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar mensajes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="messages-layout">
        <div className="messages-list">
          {filteredMessages.length === 0 ? (
            <div className="empty-state">
              <p>No hay mensajes</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`message-item ${!msg.leido ? "unread" : ""} ${
                  selectedMessage?.id === msg.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.leido) {
                    handleMarkAsRead(msg.id);
                  }
                }}
              >
                <div className="message-status">
                  {!msg.leido && <span className="unread-dot" />}
                </div>
                <div className="message-info">
                  <div className="message-header">
                    <span className="message-name">{msg.nombre}</span>
                    <span className="message-date">
                      {new Date(msg.created_at).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="message-subject">{translateAsunto(msg.asunto)}</div>
                  <div className="message-preview">
                    {msg.mensaje.substring(0, 60)}...
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="message-detail">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <div className="header-info">
                  <h2 className="detail-name">{selectedMessage.nombre}</h2>
                  <p className="detail-email">{selectedMessage.email}</p>
                </div>
                <div className="detail-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() =>
                      selectedMessage.leido
                        ? handleMarkAsUnread(selectedMessage.id)
                        : handleMarkAsRead(selectedMessage.id)
                    }
                  >
                    {selectedMessage.leido ? "Marcar no leído" : "Marcar leído"}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <FiTrash2 /> Eliminar
                  </button>
                </div>
              </div>

              <div className="detail-meta">
                <span className="detail-subject">
                  <strong>Asunto:</strong> {translateAsunto(selectedMessage.asunto)}
                </span>
                <span className="detail-date">
                  <strong>Fecha:</strong>{" "}
                  {new Date(selectedMessage.created_at).toLocaleString("es-ES")}
                </span>
                <span className="detail-status">
                  <strong>Estado:</strong>{" "}
                  {selectedMessage.leido ? "Leído" : "No leído"}
                </span>
              </div>

              <div className="detail-content">
                <p>{selectedMessage.mensaje}</p>
              </div>

              <div className="detail-footer">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="btn btn-primary"
                >
                  Responder por email
                </a>
              </div>
            </>
          ) : (
            <div className="no-message-selected">
              <p>Selecciona un mensaje para ver su contenido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
