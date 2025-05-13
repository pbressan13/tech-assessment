import { createConsumer } from "@rails/actioncable";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/cable";
const consumer = createConsumer(WS_URL);

export const subscribeToOrders = (callback) => {
  const subscription = consumer.subscriptions.create("OrdersChannel", {
    connected() {},
    disconnected() {},
    received(data) {
      callback(data);
    },
  });

  return () => {
    subscription.unsubscribe();
  };
};
