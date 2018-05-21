# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

gameStates = [["X", "O", "X", "", "O", "O", "X", "", "X"], 
["X", "O", "", "", "O", "O", "X", "", "X"],
["", "O", "X", "", "X", "O", "", "", "X"]]

gameStates.each do |gs|
  Game.create(state: gs)
end

