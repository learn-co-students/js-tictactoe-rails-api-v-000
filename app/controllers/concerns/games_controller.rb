class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games.as_json

  end

  def create
    game = Game.new(game_params)
    game.save
    render json: game
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
    render json: game
  end

  private
  def game_params
    byebug
    params.require(:game).permit(:state => [])
  end
end
