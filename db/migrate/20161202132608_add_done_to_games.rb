class AddDoneToGames < ActiveRecord::Migration
  def change
    add_column :games, :done, :boolean
  end
end
