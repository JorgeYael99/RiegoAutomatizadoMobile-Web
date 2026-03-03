import { useEffect, useState } from "react";
import {
  FiSearch,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import {
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,
} from "../../api/contact";

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
      <div className="page-header">
        <h1>
          Mensajes de Contacto
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} nuevos</span>
          )}
        </h1>
        <button className="btn btn-secondary" onClick={fetchMessages}>
          <FiRefreshCw /> Actualizar
        </button>
      </div>

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
                <div>
                  <h2>{selectedMessage.nombre}</h2>
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

      <style>{`
        .messages-page {
          animation: fadeIn 0.3s ease;
          height: calc(100vh - 140px);
          display: flex;
          flex-direction: column;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .unread-badge {
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          margin-left: 0.5rem;
          font-weight: normal;
        }

        .filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          border: none;
          background: #f3f4f6;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .filter-tab.active {
          background: #2e7d32;
          color: white;
        }

        .messages-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 1.5rem;
          flex: 1;
          min-height: 0;
        }

        .messages-list {
          background: white;
          border-radius: 12px;
          overflow-y: auto;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .message-item {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .message-item:hover {
          background: #f9fafb;
        }

        .message-item.selected {
          background: #f0fdf4;
          border-left: 3px solid #2e7d32;
        }

        .message-item.unread {
          background: #fffbeb;
        }

        .message-status {
          display: flex;
          align-items: flex-start;
          padding-top: 0.25rem;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
        }

        .message-info {
          flex: 1;
          min-width: 0;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .message-name {
          font-weight: 600;
          color: #1e293b;
        }

        .message-date {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .message-subject {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .message-preview {
          font-size: 0.75rem;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .message-detail {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .detail-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }

        .detail-email {
          color: #6b7280;
          margin: 0.25rem 0 0 0;
        }

        .detail-actions {
          display: flex;
          gap: 0.5rem;
        }

        .detail-meta {
          display: flex;
          gap: 1.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          flex-wrap: wrap;
        }

        .detail-content {
          flex: 1;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 8px;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .detail-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .no-message-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #9ca3af;
        }

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: #9ca3af;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #6b7280;
        }

        @media (max-width: 900px) {
          .messages-layout {
            grid-template-columns: 1fr;
          }

          .messages-list {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
