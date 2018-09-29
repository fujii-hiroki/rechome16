class CreateUser < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string "name", limit: 31, null: false
      t.string "password_digest", limit: 191, null: false
      t.string "remember_token", limit: 191
      t.boolean "reset_password", null: false
    end
  end
end
