class OrderItem < ApplicationRecord
  belongs_to :order

  validates :product_name, presence: true
  validates :quantity, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :unit_price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  after_save :update_order_total
  after_destroy :update_order_total

  private

  def update_order_total
    order.calculate_total
  end
end
