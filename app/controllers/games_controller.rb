class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def show
    set_game
    binding.pry
  end

  def create
    Game.create(game_params)
  end

  def update
    set_game
    @game.update(game_params)
  end

private
  def game_params
    params.require(:game).permit(state: [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end