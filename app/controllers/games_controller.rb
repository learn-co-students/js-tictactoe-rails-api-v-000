class GamesController < ApplicationController
  before_action :set_game, only: [:edit, :update]
  def index
    @games = Game.all
  end

  def create
    @game = Game.create(game_params)
    render json: @game
  end

  def update
  end

  private

  def set_game
    @game = Game.find(params[:id])
  end

  def game_params
    params.require(:game).permit()
  end
end
