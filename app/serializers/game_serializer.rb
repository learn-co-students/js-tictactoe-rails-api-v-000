class GameSerializer

  def self.serializer(game)
    serialized_game = '{'
    serialized_game += '"game": {'
    serialized_game += '"id": ' + "#{game.id},"
    serialized_game += '"state":' + "#{game.state}" #+ game.state
    serialized_game += '}}'
  end

  def self.serializer_all(games)
    serialized_game = '{'
    serialized_game += '"games": ['

    result = games.collect do |game|
      string_game = '{'
      string_game += '"id": ' + "#{game.id},"
      string_game += '"state":' + "#{game.state}" #+ game.state
      string_game += '}'
    end

    serialized_game += result.join(",")
    serialized_game += ']}'
  end

end

#"{"game":{"id":1,"state":["X","","","","","","","",""]}}"
