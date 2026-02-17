import axios from "axios";

const API = "https://riego-automatizado-mobile-web.vercel.app/api/products";

export const getProducts = async () => {
  const response = await axios.get(`${API}`);
  return response.data;
};
