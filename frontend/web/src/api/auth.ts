import axios from "axios";

const API = "https://riego-automatizado-mobile-web.vercel.app/api/auth";

export const login = (data: any) =>
  axios.post(`${API}/login`, data);

export const register = (data: any) =>
  axios.post(`${API}/register`, data);
