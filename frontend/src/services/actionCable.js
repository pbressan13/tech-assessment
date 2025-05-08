import { createConsumer } from "@rails/actioncable";

const consumer = createConsumer("ws://localhost:3000/cable");

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
