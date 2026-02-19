import axios from "axios";

const API_URL = "https://riego-automatizado-mobile-web.vercel.app/api/contact";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

// Público: NO necesita token
export const sendContactMessage = (data: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}) => axios.post(`${API_URL}`, data);

// Admin: SÍ necesitan token
export const getContactMessages = () => 
  axios.get(`${API_URL}`, getAuthHeaders());

export const getUnreadMessagesCount = () => 
  axios.get(`${API_URL}/unread-count`, getAuthHeaders());

export const markMessageAsRead = (id: number) => 
  axios.put(`${API_URL}/${id}/read`, {}, getAuthHeaders());

export const markMessageAsUnread = (id: number) => 
  axios.put(`${API_URL}/${id}/unread`, {}, getAuthHeaders());

export const deleteMessage = (id: number) => 
  axios.delete(`${API_URL}/${id}`, getAuthHeaders());
