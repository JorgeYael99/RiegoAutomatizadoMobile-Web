import { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

interface UserPayload {
  rol: string;
}
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [rol, setRol] = useState<string | null>(() => localStorage.getItem("rol") as string | null);

  const login = (jwt: string) => {
    const decoded = jwtDecode<UserPayload>(jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("rol", decoded.rol);
    setToken(jwt);
    setRol(decoded.rol);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setToken(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ token, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
