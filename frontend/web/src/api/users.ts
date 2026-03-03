import axios from "axios";

const API_URL = "https://riego-automatizado-mobile-web.vercel.app/api/users";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const getUsers = () => 
  axios.get(`${API_URL}`, getAuthHeaders());

export const getUser = (id: number) => 
  axios.get(`${API_URL}/${id}`, getAuthHeaders());

export const updateUser = (id: number, data: { nombre: string; email: string }) =>
  axios.put(`${API_URL}/${id}`, data, getAuthHeaders());

export const updateUserRole = (id: number, rol: string) =>
  axios.put(`${API_URL}/${id}/role`, { rol }, getAuthHeaders());

export const deleteUser = (id: number) =>
  axios.delete(`${API_URL}/${id}`, getAuthHeaders());
