# frozen_string_literal: true

class OrdersChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'orders_channel'
  end
end
