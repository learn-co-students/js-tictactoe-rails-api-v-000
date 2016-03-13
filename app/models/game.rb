class Game < ActiveRecord::Base

  def parse_game(game_data)
    self.state = Array.new(9)
    # {"0"=>["0", "X"], "1"=>["1", "O"], "2"=>["3", "X"], "3"=>["4", "O"]}
    game_data.values.each_with_index do |cell, i|
    end
  end
end
