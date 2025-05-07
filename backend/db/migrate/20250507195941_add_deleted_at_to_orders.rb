class AddDeletedAtToOrders < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :deleted_at, :datetime
  end
end
