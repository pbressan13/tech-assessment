class AddOrderTypeToOrder < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :order_type, :string, default: 'transfer'
  end
end
