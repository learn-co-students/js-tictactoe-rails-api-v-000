class GamesController < ApplicationController
  before_action :set_game, only: [:update]

  def index
    render json: Game.all
  end

  def create
    @game = Game.create(game_params)
    render json: @game
  end

  def update
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
