/* eslint-disable no-useless-catch */
import {
  getOrders,
  createOrder,
  updateOrder,
  processOrder,
  completeOrder,
  cancelOrder,
  getOrder,
} from "../services/api";
import Order from "../models/Order";

class OrdersController {
  constructor() {
    this.orders = [];
    this.listeners = new Set();
  }

  addListener(listener) {
    this.listeners.add(listener);
    listener(this.orders);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.orders));
  }

  async fetchOrders() {
    try {
      const response = await getOrders();
      this.orders = response.data
        .map((order) => Order.fromJSON(order))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      this.notifyListeners();
    } catch (error) {
      throw error;
    }
  }

  async getOrder(id) {
    try {
      const response = await getOrder(id);
      return Order.fromJSON(response.data);
    } catch (error) {
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const response = await createOrder(orderData);
      const newOrder = Order.fromJSON(response.data);
      this.orders = [newOrder, ...this.orders];
      this.notifyListeners();
      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(id, orderData) {
    try {
      const response = await updateOrder(id, orderData);
      const updatedOrder = Order.fromJSON(response.data);
      this.orders = this.orders.map((order) =>
        order.id === id ? updatedOrder : order
      );
      this.notifyListeners();
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  async processOrder(orderId) {
    try {
      const response = await processOrder(orderId);
      const updatedOrder = Order.fromJSON(response.data);
      this.orders = this.orders.map((order) =>
        order.id === orderId ? updatedOrder : order
      );
      this.notifyListeners();
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  async completeOrder(orderId) {
    try {
      const response = await completeOrder(orderId);
      const updatedOrder = Order.fromJSON(response.data);
      this.orders = this.orders.map((order) =>
        order.id === orderId ? updatedOrder : order
      );
      this.notifyListeners();
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await cancelOrder(orderId);
      const updatedOrder = Order.fromJSON(response.data);
      this.orders = this.orders.map((order) =>
        order.id === orderId ? updatedOrder : order
      );
      this.notifyListeners();
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  get orderCount() {
    return this.orders.length;
  }
}

export default new OrdersController();
