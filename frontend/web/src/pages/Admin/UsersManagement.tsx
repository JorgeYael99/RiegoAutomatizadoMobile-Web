import { useEffect, useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiX, FiShield } from "react-icons/fi";
import "./UsersManagement.css";
import { updateUser, updateUserRole, deleteUser } from "../../api/users";

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  created_at: string;
}

const API_USERS = "https://riego-automatizado-mobile-web.vercel.app/api/users";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "" });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_USERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        nombre: form.nombre,
        email: form.email,
      });
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!editingUser) return;

    try {
      await updateUserRole(editingUser.id, newRole);
      setShowRoleModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al eliminar usuario");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({ nombre: user.nombre, email: user.email });
    setShowEditModal(true);
  };

  const openRoleModal = (user: User) => {
    setEditingUser(user);
    setShowRoleModal(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Usuarios</h1>
      </div>

      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-name">{user.nombre}</div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.rol}`}>
                    {user.rol === "admin" ? "👑 Admin" : "Cliente"}
                  </span>
                </td>
                <td>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("es-ES")
                    : "-"}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => openEditModal(user)}
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => openRoleModal(user)}
                      title="Cambiar Rol"
                    >
                      <FiShield />
                    </button>
                    {user.rol !== "admin" && (
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(user.id)}
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-cell">
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Usuario</h2>
              <button className="btn-icon" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cambiar Rol</h2>
              <button className="btn-icon" onClick={() => setShowRoleModal(false)}>
                <FiX />
              </button>
            </div>
            <p style={{ marginBottom: "1rem", color: "#6b7280" }}>
              Selecciona el nuevo rol para <strong>{editingUser.nombre}</strong>
            </p>
            <div className="role-options">
              <button
                className={`role-option ${editingUser.rol === "cliente" ? "active" : ""}`}
                onClick={() => handleRoleChange("cliente")}
              >
                <span className="role-icon">👤</span>
                <span className="role-label">Cliente</span>
                <span className="role-desc">Acceso básico a la tienda</span>
              </button>
              <button
                className={`role-option ${editingUser.rol === "admin" ? "active" : ""}`}
                onClick={() => handleRoleChange("admin")}
              >
                <span className="role-icon">👑</span>
                <span className="role-label">Administrador</span>
                <span className="role-desc">Acceso completo al panel</span>
              </button>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
