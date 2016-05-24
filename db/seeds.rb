# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

@state = [
  ["X", "O", "X", "", "", "O", "X", "", "O"],
  ["O", "", "", "X", "X", "", "X", "", ""],
  ["", "O", "", "", "", "O", "X", "", "O"],
  ["", "O", "X", "", "", "", "", "X", ""],
  ["O", "", "X", "", "X", "", "X", "", "O"],
  ["X", "O", "X", "", "", "O", "", "", ""],
  ["X", "", "X", "X", "", "", "X", "", "O"],
  ["", "O", "X", "", "", "O", "", "", "O"],
  ["", "", "X", "", "", "", "X", "", ""],
  ["O", "", "X", "", "X", "X", "", "X", ""],
]

def create_games
  i = 0
  while i <= 10 do
    Game.create(state: @state[i], created_at: Time.now)
    i += 1
  end
end

create_games
