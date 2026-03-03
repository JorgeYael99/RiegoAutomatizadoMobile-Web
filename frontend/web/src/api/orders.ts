import axios from "axios";

const API_URL = "https://riego-automatizado-mobile-web.vercel.app/api/orders";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const getOrders = () => 
  axios.get(`${API_URL}`, getAuthHeaders());

export const getOrder = (id: number) => 
  axios.get(`${API_URL}/${id}`, getAuthHeaders());

export const getOrderStats = () => 
  axios.get(`${API_URL}/stats`, getAuthHeaders());

export const exportOrders = () => 
  axios.get(`${API_URL}/export`, getAuthHeaders());
