# frozen_string_literal: true

module Orders
  class OrderService < BaseService
    def initialize(order = nil, params = {})
      super()
      @order = order
      @params = params
    end

    def self.for(order_type = 'transfer')
      # if order_type is not provided, use "transfer" as default
      order_type = 'transfer' if order_type.blank?
      service_class_name = "Orders::#{order_type.capitalize}OrderService"
      service_class_name.constantize
    rescue StandardError
      raise 'Unkown order type'
    end

    def create
      Order.transaction do
        order = Order.new(@params)
        if order.save
          broadcast_order_update(order, 'order_created')
          { success: true, order: order }
        else
          { success: false, errors: order.errors.full_messages }
        end
      end
    rescue StandardError => e
      Rails.logger.error "Error creating order: #{e.message}"
      { success: false, errors: [e.message] }
    end

    def process_order
      Order.transaction do
        if @order.process_order!
          broadcast_order_update(@order, 'order_processing')
          { success: true, order: @order }
        else
          { success: false, errors: @order.errors.full_messages }
        end
      end
    rescue StandardError => e
      Rails.logger.error "Error processing order: #{e.message}"
      { success: false, errors: [e.message] }
    end

    def complete
      Order.transaction do
        if @order.complete!
          broadcast_order_update(@order, 'order_completed')
          { success: true, order: @order }
        else
          { success: false, errors: @order.errors.full_messages }
        end
      end
    rescue StandardError => e
      Rails.logger.error "Error completing order: #{e.message}"
      { success: false, errors: [e.message] }
    end

    def cancel
      Order.transaction do
        if @order.cancel!
          broadcast_order_update(@order, 'order_cancelled')
          { success: true, order: @order }
        else
          { success: false, errors: @order.errors.full_messages }
        end
      end
    rescue StandardError => e
      Rails.logger.error "Error cancelling order: #{e.message}"
      { success: false, errors: [e.message] }
    end
  end
end
