# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Order, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:customer_email) }
    it { should validate_numericality_of(:total).is_greater_than_or_equal_to(0) }

    it 'validates presence of status' do
      order = build(:order, status: nil)
      order.send(:set_initial_status)
      expect(order).to be_valid
      expect(order.status).to eq('pending')
    end
  end

  describe 'associations' do
    it { should have_many(:order_items).dependent(:destroy) }
  end

  describe 'state machine' do
    let(:order) { create(:order) }

    it 'has initial state of pending' do
      expect(order.status).to eq('pending')
    end

    it 'transitions from pending to processing' do
      expect { order.process_order }.to change { order.status }.from('pending').to('processing')
    end

    it 'transitions from processing to completed' do
      order.process_order!
      expect { order.complete! }.to change { order.status }.from('processing').to('completed')
    end

    it 'transitions from pending to cancelled' do
      expect { order.cancel! }.to change { order.status }.from('pending').to('cancelled')
    end

    it 'cannot transition from cancelled to processing' do
      order.cancel!
      expect { order.process_order! }.to raise_error(AASM::InvalidTransition)
    end

    it 'cannot transition from completed to processing' do
      order.process_order!
      order.complete!
      expect { order.process_order! }.to raise_error(AASM::InvalidTransition)
    end
  end

  describe 'callbacks' do
    it 'calculates total before save' do
      order = build(:order)
      order_item1 = build(:order_item, unit_price: 10.0, quantity: 2)
      order_item2 = build(:order_item, unit_price: 5.0, quantity: 3)
      order.order_items << order_item1
      order.order_items << order_item2
      
      order.save
      expect(order.total).to eq(35.0) # (10.0 * 2) + (5.0 * 3)
    end

    it 'sets initial status to pending' do
      order = build(:order, status: nil)
      order.valid?
      expect(order.status).to eq('pending')
    end
  end

  describe 'scopes' do
    let!(:pending_order) { create(:order, status: 'pending') }
    let!(:processing_order) { create(:order, status: 'processing') }
    let!(:completed_order) { create(:order, status: 'completed') }
    let!(:cancelled_order) { create(:order, status: 'cancelled') }

    it 'filters by status' do
      expect(Order.pending).to include(pending_order)
      expect(Order.processing).to include(processing_order)
      expect(Order.completed).to include(completed_order)
      expect(Order.cancelled).to include(cancelled_order)
    end
  end

  describe 'methods' do
    describe '#calculate_total' do
      it 'calculates total from order items' do
        order = create(:order)
        create(:order_item, order: order, unit_price: 10.0, quantity: 2)
        create(:order_item, order: order, unit_price: 5.0, quantity: 3)

        order.reload
        
        order.calculate_total
        expect(order.total).to eq(35.0)
      end

      it 'returns 0 when no order items' do
        order = create(:order)
        order.calculate_total
        expect(order.total).to eq(0.0)
      end
    end
  end
end 