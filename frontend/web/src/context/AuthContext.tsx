import { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

interface UserPayload {
  rol: string;
  nombre?: string;
}
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [rol, setRol] = useState<string | null>(() => localStorage.getItem("rol") as string | null);
  const [nombre, setNombre] = useState<string | null>(() => localStorage.getItem("nombre"));

  const login = (jwt: string, userNombre?: string) => {
    const decoded = jwtDecode<UserPayload>(jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("rol", decoded.rol);
    localStorage.setItem("nombre", userNombre || decoded.nombre || "Usuario");
    setToken(jwt);
    setRol(decoded.rol);
    setNombre(userNombre || decoded.nombre || "Usuario");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
    setToken(null);
    setRol(null);
    setNombre(null);
  };

  return (
    <AuthContext.Provider value={{ token, rol, nombre, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
