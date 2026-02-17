import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const login = (data: any) =>
  axios.post(`${API}/login`, data);

export const register = (data: any) =>
  axios.post(`${API}/register`, data);
