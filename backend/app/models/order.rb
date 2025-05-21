# frozen_string_literal: true

class Order < ApplicationRecord
  include AASM

  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items, allow_destroy: true

  validates :customer_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, presence: true
  validates :total, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :order_type, presence: true

  before_validation :set_initial_status
  after_save :calculate_total

  aasm column: :status do
    state :pending, initial: true
    state :processing
    state :completed
    state :cancelled

    event :process_order do
      transitions from: :pending, to: :processing
    end

    event :complete do
      transitions from: :processing, to: :completed
    end

    event :cancel do
      transitions from: %i[pending processing], to: :cancelled
    end
  end

  def calculate_total
    new_total = order_items.sum { |item| item.quantity * item.unit_price }
    update_column(:total, new_total) if total != new_total
  end

  private

  def set_initial_status
    self.status ||= :pending
  end
end
