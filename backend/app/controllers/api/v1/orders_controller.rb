module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: [:show, :update, :process_order, :complete, :cancel]

      def index
        @orders = Order.includes(:order_items).order(created_at: :desc)
        render json: @orders
      end

      def show
        render json: @order
      end

      def create
        result = Orders::OrderService.new(nil, order_params).create

        if result[:success]
          render json: result[:order], status: :created
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      def update
        result = Orders::OrderService.new(@order, order_params).update

        if result[:success]
          render json: result[:order]
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      def process_order
        result = Orders::OrderService.new(@order).process

        if result[:success]
          render json: result[:order]
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      def complete
        result = Orders::OrderService.new(@order).complete

        if result[:success]
          render json: result[:order]
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      def cancel
        result = Orders::OrderService.new(@order).cancel

        if result[:success]
          render json: result[:order]
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      private

      def set_order
        @order = Order.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Order not found' }, status: :not_found
      end

      def order_params
        params.require(:order).permit(
          :customer_email,
          :status,
          order_items_attributes: [:id, :product_name, :quantity, :unit_price, :_destroy]
        )
      end
    end
  end
end
