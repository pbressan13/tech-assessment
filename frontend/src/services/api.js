import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post("/orders", data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const processOrder = (id) => api.post(`/orders/${id}/process_order`);
export const completeOrder = (id) => api.post(`/orders/${id}/complete`);
export const cancelOrder = (id) => api.post(`/orders/${id}/cancel`);
