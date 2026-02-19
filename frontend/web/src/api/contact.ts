import axios from "axios";
const API_URL = "https://riego-automatizado-mobile-web.vercel.app/api/contact";
// Enviar mensaje de contacto (público)
export const sendContactMessage = (data: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}) => axios.post(`${API_URL}`, data);
// Obtener todos los mensajes (admin)
export const getContactMessages = () => axios.get(`${API_URL}`);
// Obtener contador de no leídos (admin)
export const getUnreadMessagesCount = () => 
  axios.get(`${API_URL}/unread-count`);
// Marcar como leído (admin)
export const markMessageAsRead = (id: number) => 
  axios.put(`${API_URL}/${id}/read`);
// Marcar como no leído (admin)
export const markMessageAsUnread = (id: number) => 
  axios.put(`${API_URL}/${id}/unread`);
// Eliminar mensaje (admin)
export const deleteMessage = (id: number) => 
  axios.delete(`${API_URL}/${id}`);