import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: any) {
  const { token, rol } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (rol !== "admin") return <Navigate to="/" />;

  return children;
}
