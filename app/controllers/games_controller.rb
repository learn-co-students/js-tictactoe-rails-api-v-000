class GamesController < ApplicationController
  def index
    @games = Game.all.map
    render json: {games: @games.collect {|game| game.as_json(only: [:id, :state])}}
  end

  def create
    game = Game.create(game_params)
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
  end

  private

    def game_params
      params.require(:game).permit({state: []})
    end
end
