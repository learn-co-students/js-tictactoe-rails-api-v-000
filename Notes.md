Phase 1

- Build object called game
- Game does all the functions

Phase 2


player()
Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd

  def current_player
      @board.turn_count % 2 == 0 ? @player_1 : @player_2
  end
