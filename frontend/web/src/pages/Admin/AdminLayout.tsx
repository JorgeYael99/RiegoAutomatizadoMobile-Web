import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiMessageSquare,
  FiBarChart2,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import "./AdminLayout.css";

const menuItems = [
  { path: "/admin", icon: FiHome, label: "Dashboard" },
  { path: "/admin/products", icon: FiPackage, label: "Productos" },
  { path: "/admin/users", icon: FiUsers, label: "Usuarios" },
  { path: "/admin/messages", icon: FiMessageSquare, label: "Mensajes" },
  { path: "/admin/sales", icon: FiBarChart2, label: "Ventas" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="admin-mobile-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <FiMenu size={24} />
        </button>
        <h1>Admin Panel</h1>
      </header>

      {/* Sidebar Overlay (mobile) */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
              end={item.path === "/admin"}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {menuItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            end={item.path === "/admin"}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button className="mobile-nav-item" onClick={handleLogout}>
          <FiLogOut size={20} />
          <span>Salir</span>
        </button>
      </nav>
    </div>
  );
}
