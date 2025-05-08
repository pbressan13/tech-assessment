# frozen_string_literal: true

FactoryBot.define do
  factory :order_item do
    product_name { Faker::Commerce.product_name }
    quantity { Faker::Number.between(from: 1, to: 10) }
    unit_price { Faker::Commerce.price }

    association :order
  end
end
