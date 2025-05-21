# frozen_string_literal: true

module Orders
  class TransferOrderService < OrderService
    def create
      result = super
      if result[:success]
        @order = result[:order]
        schedule_confirmation_email
      end
      result
    end

    def schedule_confirmation_email
      OrderMailer.confirmation_email(@order).deliver_later
    end
  end
end
