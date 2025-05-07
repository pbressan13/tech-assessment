class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.string :customer_email
      t.string :status
      t.decimal :total

      t.timestamps
    end
  end
end
