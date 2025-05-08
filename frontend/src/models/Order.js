class Order {
  constructor(data) {
    this.id = data.id;
    this.customerEmail = data.customer_email;
    this.status = data.status;
    this.orderItems = (data.order_items || []).map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }));
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
  }

  get total() {
    return this.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
  }

  get formattedTotal() {
    return `$${this.total.toFixed(2)}`;
  }

  get formattedCreatedAt() {
    return this.createdAt.toLocaleString();
  }

  get formattedUpdatedAt() {
    return this.updatedAt.toLocaleString();
  }

  static fromJSON(data) {
    return new Order(data);
  }
}

export default Order;
