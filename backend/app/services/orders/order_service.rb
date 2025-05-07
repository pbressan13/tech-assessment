module Orders
  class OrderService < BaseService
    def initialize(order = nil, params = {})
      @order = order
      @params = params
    end

    def create
      Order.transaction do
        Rails.logger.info "Creating order #{@params.inspect}"
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

    def update
      Order.transaction do
        Rails.logger.info "Updating order #{@order.id} with params #{@params.inspect}"
        
        if @order.update(@params)
          broadcast_order_update(@order, 'order_updated')
          { success: true, order: @order }
        else
          { success: false, errors: @order.errors.full_messages }
        end
      end
    rescue StandardError => e
      Rails.logger.error "Error updating order: #{e.message}"
      { success: false, errors: [e.message] }
    end

    def process
      Order.transaction do
        Rails.logger.info "Processing order #{@order.id}"
        
        if @order.process!
          broadcast_order_update(@order, 'order_processed')
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
        Rails.logger.info "Completing order #{@order.id}"
        
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
        Rails.logger.info "Cancelling order #{@order.id}"
        
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