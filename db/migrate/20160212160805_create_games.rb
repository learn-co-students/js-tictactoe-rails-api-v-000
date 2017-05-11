class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.text :state
      t.integer :player_id
      t.timestamps null: false
    end
  end
end
