class RemoveDeletedAtFromOrders < ActiveRecord::Migration[7.2]
  def change
    remove_column :orders, :deleted_at, :datetime
  end
end
