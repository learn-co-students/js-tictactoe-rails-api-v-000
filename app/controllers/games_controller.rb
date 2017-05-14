class GamesController < ApplicationController

  def create
    Game.create(game_params(params))
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params(params))
  end

  def index
    @games = Game.all
    render json: {games: @games.collect {|game| game.as_json(only: [:id, :state])}}
  end

  private
    def game_params(params)
      {state: params["game"]["state"]}
    end

end