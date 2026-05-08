import axios from "axios";

const API = "https://riego-automatizado-mobile-web.vercel.app/api/auth";

export const login = (data: any) =>
  axios.post(`${API}/login`, data);

export const register = (data: any) =>
  axios.post(`${API}/register`, data);

export const getCaptcha = () =>
  axios.get(`${API}/captcha`);

export const verifyEmailCode = (data: any) =>
  axios.post(`${API}/verify-email-code`, data);

export const verifyRegister = (data: any) =>
  axios.post(`${API}/verify-register`, data);
