class GamesController < ApplicationController
  def create
    game = Game.create
  end

  def update
    game = Game.find(params[:id])
    game.state = params[:game][:state]
    game.save
  end

  def index
    games = Game.all.map { |game| ::GameSerializer.new(game) }
    render json: { games: games }
  end

end
