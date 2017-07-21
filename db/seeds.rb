# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

game1 = Game.create(state: ['X', 'X', 'O', 'X', 'O', 'O', 'O', 'X', 'X'])
game2 = Game.create(state: ['O', 'O', 'X', 'O', 'X', 'X', 'X', 'O', 'O'])
game3 = Game.create(state: ['X', 'O', 'X', 'O', 'X', 'O', 'X', '', ''])
