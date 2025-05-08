# frozen_string_literal: true

class OrderSerializer < ActiveModel::Serializer
  attributes :id, :customer_email, :status, :total, :created_at, :updated_at

  has_many :order_items

  def total
    object.total || object.calculate_total
  end
end
