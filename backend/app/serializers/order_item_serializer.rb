# frozen_string_literal: true

class OrderItemSerializer < ActiveModel::Serializer
  attributes :id, :product_name, :quantity, :unit_price, :subtotal

  def subtotal
    object.quantity * object.unit_price
  end
end
