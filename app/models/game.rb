class Game < ActiveRecord::Base
  serialize :state, JSON #(optional enforcement of data type)

  # game = Game.new
  # game.state = {game_board_keys: value}
  # game.save #=>saved as YAML in a text field, later retrieved as a
end
