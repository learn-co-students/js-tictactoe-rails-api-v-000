class GamesController < ApplicationController

  def create
    @game = Game.create(game_params)
    render json: @game.id

  end

  def update
  end

  def index
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end

end
