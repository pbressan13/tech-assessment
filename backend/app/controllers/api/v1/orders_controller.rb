# frozen_string_literal: true

module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: %i[show process_order complete cancel]

      def index
        @orders = Order.includes(:order_items).order(created_at: :desc)
        render json: @orders
      end

      def show
        render json: @order
      end

      def create
        result = order_service.create

        if result[:success]
          render json: result[:order], status: :created
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      def process_order
        result = order_service.process_order

        if result[:success]
          render json: result[:order]
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      def complete
        result = order_service.complete

        if result[:success]
          render json: result[:order]
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      def cancel
        result = order_service.cancel

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
          :order_type,
          order_items_attributes: %i[id product_name quantity unit_price order_type _destroy]
        )
      end

      def order_service
        order_type = @order.blank? ? order_params[:order_type] ||= 'transfer' : @order.order_type
        if @order.blank?
          @order_service ||= Orders::OrderService.for(order_type).new(nil, order_params)
        else            
          @order_service ||= Orders::OrderService.for(order_type).new(@order)
        end
      end
    end
  end
end
