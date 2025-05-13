import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getOrders = () => api.get("/api/v1/orders");
export const getOrder = (id) => api.get(`/api/v1/orders/${id}`);
export const createOrder = (data) => api.post("/api/v1/orders", data);
export const updateOrder = (id, data) => api.put(`/api/v1/orders/${id}`, data);
export const processOrder = (id) =>
  api.post(`/api/v1/orders/${id}/process_order`);
export const completeOrder = (id) => api.post(`/api/v1/orders/${id}/complete`);
export const cancelOrder = (id) => api.post(`/api/v1/orders/${id}/cancel`);
