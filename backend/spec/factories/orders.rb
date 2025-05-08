# frozen_string_literal: true

FactoryBot.define do
  factory :order do
    customer_email { Faker::Internet.email }
    status { 'pending' }
    total { 0.0 }

    trait :processing do
      status { 'processing' }
    end

    trait :completed do
      status { 'completed' }
    end
  end
end 