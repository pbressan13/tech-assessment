# frozen_string_literal: true

module Orders
  class BaseService
    def initialize(params = {})
      @params = params
    end

    private

    def broadcast_order_update(order, type)
      ActionCable.server.broadcast(
        'orders_channel',
        {
          type: type,
          order: OrderSerializer.new(order).as_json
        }
      )
    end
  end
end
