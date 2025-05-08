# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::OrdersController, type: :controller do
  describe 'GET #index' do
    let!(:orders) { FactoryBot.create_list(:order, 3) }

    it 'returns a successful response' do
      get :index
      expect(response).to have_http_status(:ok)
    end

    it 'returns all orders' do
      get :index
      expect(JSON.parse(response.body).size).to eq(3)
    end

    it 'filters by status' do
      get :index, params: { status: 'pending' }
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET #show' do
    let(:order) { create(:order) }

    it 'returns a successful response' do
      get :show, params: { id: order.id }
      expect(response).to have_http_status(:ok)
    end

    it 'returns the requested order' do
      get :show, params: { id: order.id }
      expect(JSON.parse(response.body)['id']).to eq(order.id)
    end

    it 'returns not found for invalid id' do
      get :show, params: { id: 999 }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        order: {
          customer_email: 'test@example.com',
          order_items_attributes: [
            { product_name: 'Product 1', quantity: 2, unit_price: 10.0 },
            { product_name: 'Product 2', quantity: 1, unit_price: 20.0 }
          ]
        }
      }
    end

    it 'creates a new order' do
      expect do
        post :create, params: valid_params
      end.to change(Order, :count).by(1)
    end

    it 'returns created status' do
      post :create, params: valid_params
      expect(response).to have_http_status(:created)
    end

    it 'creates order items' do
      expect do
        post :create, params: valid_params
      end.to change(OrderItem, :count).by(2)
    end

    context 'with invalid params' do
      let(:invalid_params) do
        { order: { customer_email: '' } }
      end

      it 'does not create a new order' do
        expect do
          post :create, params: invalid_params
        end.not_to change(Order, :count)
      end

      it 'returns unprocessable entity status' do
        post :create, params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST #process_order' do
    let(:order) { create(:order) }

    it 'processes the order' do
      post :process_order, params: { id: order.id }
      expect(order.reload.status).to eq('processing')
    end

    it 'returns ok status' do
      post :process_order, params: { id: order.id }
      expect(response).to have_http_status(:ok)
    end

    context 'when order cannot be processing' do
      before { order.cancel! }

      it 'returns unprocessable entity status' do
        post :process_order, params: { id: order.id }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST #complete' do
    let(:order) { create(:order) }

    before { order.process_order! }

    it 'completes the order' do
      post :complete, params: { id: order.id }
      expect(order.reload.status).to eq('completed')
    end

    it 'returns ok status' do
      post :complete, params: { id: order.id }
      expect(response).to have_http_status(:ok)
    end

    context 'when order cannot be completed' do
      before { order.cancel! }

      it 'returns unprocessable entity status' do
        post :complete, params: { id: order.id }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST #cancel' do
    let(:order) { create(:order) }

    it 'cancels the order' do
      post :cancel, params: { id: order.id }
      expect(order.reload.status).to eq('cancelled')
    end

    it 'returns ok status' do
      post :cancel, params: { id: order.id }
      expect(response).to have_http_status(:ok)
    end

    context 'when order cannot be cancelled' do
      before do
        order.process_order!
        order.complete!
      end

      it 'returns unprocessable entity status' do
        post :cancel, params: { id: order.id }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
