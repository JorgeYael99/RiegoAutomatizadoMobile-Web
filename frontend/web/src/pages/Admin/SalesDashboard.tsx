import { useEffect, useState } from "react";
import {
  FiDownload,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";
import "./SalesDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface Stats {
  total_ingresos: number;
  total_pedidos: number;
  estados: { estado: string; count: number }[];
  top_products: { nombre: string; total_vendido: number }[];
  ventas_diarias: { fecha: string; ingresos: number; pedidos: number }[];
}

const COLORS = ["#2e7d32", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function SalesDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await fetch(
        "https://riego-automatizado-mobile-web.vercel.app/api/orders/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      const res = await fetch(
        "https://riego-automatizado-mobile-web.vercel.app/api/orders/export",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const orders = await res.json();

      if (!Array.isArray(orders) || orders.length === 0) {
        alert("No hay pedidos para exportar");
        return;
      }

      const headers = ["ID", "Cliente", "Email", "Total", "Estado", "Fecha"];
      const csvContent = [
        headers.join(","),
        ...orders.map((o: any) =>
          [
            o.id,
            `"${o.cliente || ""}"`,
            `"${o.email || ""}"`,
            o.total,
            o.estado,
            o.created_at ? new Date(o.created_at).toLocaleDateString() : "",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `pedidos_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
    } catch (error) {
      console.error("Error exporting:", error);
      alert("Error al exportar");
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { weekday: "short" });
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  const estadoData = stats?.estados.map((e) => ({
    name: e.estado.charAt(0).toUpperCase() + e.estado.slice(1),
    value: e.count,
  })) || [];

  const ventasData = stats?.ventas_diarias.map((v) => ({
    ...v,
    fecha: formatDate(v.fecha),
  })) || [];

  const topData = stats?.top_products.map((p) => ({
    name: p.nombre.length > 15 ? p.nombre.substring(0, 15) + "..." : p.nombre,
    ventas: p.total_vendido,
  })) || [];

  return (
    <div className="sales-page">
      <div className="page-header">
        <h1>Ventas y Estadísticas</h1>
        <button className="btn btn-primary" onClick={handleExport}>
          <FiDownload /> Exportar CSV
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <FiDollarSign size={24} />
          </div>
          <h3>Ingresos Totales</h3>
          <div className="stat-value">{formatCurrency(stats?.total_ingresos || 0)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
            <FiShoppingCart size={24} />
          </div>
          <h3>Total Pedidos</h3>
          <div className="stat-value">{stats?.total_pedidos || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <FiTrendingUp size={24} />
          </div>
          <h3>Ticket Promedio</h3>
          <div className="stat-value">
            {stats?.total_pedidos
              ? formatCurrency(stats.total_ingresos / stats.total_pedidos)
              : formatCurrency(0)}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Ventas por Día (Últimos 7 días)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ventasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="fecha" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
                />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#2e7d32"
                  strokeWidth={3}
                  dot={{ fill: "#2e7d32", strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Pedidos por Estado</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={estadoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {estadoData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Top 5 Productos Más Vendidos</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value} uds`, "Vendidos"]}
                />
                <Bar dataKey="ventas" fill="#2e7d32" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
