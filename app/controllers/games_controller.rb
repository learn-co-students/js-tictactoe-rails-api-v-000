class GamesController < ApplicationController
before_action :set_game, only: [:update]

  def index
    @games = Game.all
    render json: @games
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.create(game_params)
    redirect_to game_path(@game)
  end

  def update
    @game.update(game_params)
    @game.save
    render json: @game
  end

private
  def set_game
    @game = Game.find(params[:id])
  end

  def game_params
    params.require(:game).permit(state: [])
  end
end
