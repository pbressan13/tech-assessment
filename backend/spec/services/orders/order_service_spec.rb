# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Orders::OrderService do
  let(:order) { FactoryBot.create(:order) }
  let(:params) { attributes_for(:order) }
  let(:service) { described_class.new(order, params) }

  describe '#initialize' do
    it 'initializes with order and params' do
      expect(service.instance_variable_get(:@order)).to eq(order)
      expect(service.instance_variable_get(:@params)).to eq(params)
    end

    it 'initializes with nil order' do
      service = described_class.new(nil, params)
      expect(service.instance_variable_get(:@order)).to be_nil
    end
  end

  describe '#create' do
    let(:service) { described_class.new(nil, params) }

    context 'when successful' do
      it 'creates a new order' do
        expect { service.create }.to change(Order, :count).by(1)
      end

      it 'returns success with order' do
        result = service.create
        expect(result[:success]).to be true
        expect(result[:order]).to be_a(Order)
      end

      it 'broadcasts order_created event' do
        expect(ActionCable.server).to receive(:broadcast) do |channel, data|
          expect(channel).to eq('orders_channel')
          expect(data[:type]).to eq('order_created')
          expect(data[:order]).to satisfy do |order|
            expect(order[:id]).to be_a(Integer)
            expect(order[:customer_email]).to be_a(String)
            expect(order[:order_items]).to be_a(Array)
            expect(order[:status]).to eq('pending')
            expect(order[:total]).to be_a(BigDecimal)
            expect(order[:created_at]).to be_a(Time)
            expect(order[:updated_at]).to be_a(Time)
          end
        end
        service.create
      end
    end

    context 'when unsuccessful' do
      let(:params) { { invalid: 'params' } }

      it 'returns error messages' do
        result = service.create
        expect(result[:success]).to be false
        expect(result[:errors]).to be_present
      end
    end
  end

  describe '#process_order' do
    context 'when successful' do
      it 'processes the order' do
        expect(order).to receive(:process_order!).and_return(true)
        result = service.process_order
        expect(result[:success]).to be true
      end

      it 'broadcasts order_processed event' do
        allow(order).to receive(:process_order!).and_return(true)
        expect(ActionCable.server).to receive(:broadcast) do |channel, data|
          expect(channel).to eq('orders_channel')
          expect(data[:type]).to eq('order_processing')
          expect(data[:order]).to satisfy do |order|
            expect(order[:id]).to eq(order.id)
            expect(order[:customer_email]).to eq(order.customer_email)
            expect(order[:order_items]).to eq([])
            expect(order[:status]).to eq('pending')
            expect(order[:total]).to be_a(BigDecimal)
            expect(order[:created_at]).to be_a(Time)
            expect(order[:updated_at]).to be_a(Time)
          end
        end
        service.process_order
      end
    end

    context 'when unsuccessful' do
      it 'returns error messages' do
        allow(order).to receive(:process_order!).and_return(false)
        allow(order).to receive_message_chain(:errors, :full_messages).and_return(['Error message'])
        
        result = service.process_order
        expect(result[:success]).to be false
        expect(result[:errors]).to include('Error message')
      end
    end
  end

  describe '#complete' do
    context 'when successful' do
      it 'completes the order' do
        expect(order).to receive(:complete!).and_return(true)
        result = service.complete
        expect(result[:success]).to be true
      end

      it 'broadcasts order_completed event' do
        allow(order).to receive(:complete!).and_return(true)
        expect(ActionCable.server).to receive(:broadcast) do |channel, data|
          expect(channel).to eq('orders_channel')
          expect(data[:type]).to eq('order_completed')
          expect(data[:order]).to satisfy do |order|
            expect(order[:id]).to eq(order.id)
            expect(order[:customer_email]).to eq(order.customer_email)
            expect(order[:order_items]).to eq([])
            expect(order[:status]).to eq('pending')
            expect(order[:total]).to be_a(BigDecimal)
            expect(order[:created_at]).to be_a(Time)
            expect(order[:updated_at]).to be_a(Time)
          end
        end
        service.complete
      end
    end

    context 'when unsuccessful' do
      it 'returns error messages' do
        allow(order).to receive(:complete!).and_return(false)
        allow(order).to receive_message_chain(:errors, :full_messages).and_return(['Error message'])
        
        result = service.complete
        expect(result[:success]).to be false
        expect(result[:errors]).to include('Error message')
      end
    end
  end

  describe '#cancel' do
    context 'when successful' do
      it 'cancels the order' do
        expect(order).to receive(:cancel!).and_return(true)
        result = service.cancel
        expect(result[:success]).to be true
      end

      it 'broadcasts order_cancelled event' do
        allow(order).to receive(:cancel!).and_return(true)
        expect(ActionCable.server).to receive(:broadcast) do |channel, data|
          expect(channel).to eq('orders_channel')
          expect(data[:type]).to eq('order_cancelled')
          expect(data[:order]).to satisfy do |order|
            expect(order[:id]).to eq(order.id)
            expect(order[:customer_email]).to eq(order.customer_email)
            expect(order[:order_items]).to eq([])
            expect(order[:status]).to eq('pending')
            expect(order[:total]).to be_a(BigDecimal)
            expect(order[:created_at]).to be_a(Time)
            expect(order[:updated_at]).to be_a(Time)
          end
        end
        service.cancel
      end
    end

    context 'when unsuccessful' do
      it 'returns error messages' do
        allow(order).to receive(:cancel!).and_return(false)
        allow(order).to receive_message_chain(:errors, :full_messages).and_return(['Error message'])
        
        result = service.cancel
        expect(result[:success]).to be false
        expect(result[:errors]).to include('Error message')
      end
    end
  end

  describe 'error handling' do
    it 'handles StandardError in create' do
      service = described_class.new(nil, params)
      allow(Order).to receive(:new).and_raise(StandardError.new('Test error'))
      result = service.create
      expect(result[:success]).to be false
      expect(result[:errors]).to include('Test error')
    end

    it 'handles StandardError in process_order' do
      allow(order).to receive(:process_order!).and_raise(StandardError.new('Test error'))
      result = service.process_order
      expect(result[:success]).to be false
      expect(result[:errors]).to include('Test error')
    end

    it 'handles StandardError in complete' do
      allow(order).to receive(:complete!).and_raise(StandardError.new('Test error'))
      result = service.complete
      expect(result[:success]).to be false
      expect(result[:errors]).to include('Test error')
    end

    it 'handles StandardError in cancel' do
      allow(order).to receive(:cancel!).and_raise(StandardError.new('Test error'))
      result = service.cancel
      expect(result[:success]).to be false
      expect(result[:errors]).to include('Test error')
    end
  end
end 