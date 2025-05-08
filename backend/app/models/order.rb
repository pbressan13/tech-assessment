# frozen_string_literal: true

class Order < ApplicationRecord
  include AASM

  has_many :order_items, dependent: :destroy
  accepts_nested_attributes_for :order_items, allow_destroy: true

  validates :customer_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, presence: true
  validates :total, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  before_validation :set_initial_status
  after_create :schedule_confirmation_email
  after_save :calculate_total

  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }

  aasm column: :status do
    state :pending, initial: true
    state :processing
    state :completed
    state :cancelled

    event :process do
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

  def invalidate!
    update_column(:deleted_at, Time.current)
  end

  def invalidated?
    deleted_at.present?
  end

  private

  def set_initial_status
    self.status ||= :pending
  end

  def schedule_confirmation_email
    OrderMailer.confirmation_email(self).deliver_later
  end
end
