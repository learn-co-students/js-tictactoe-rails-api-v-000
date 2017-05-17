class GamesController < ApplicationController

  def index
    render json: Game.all
  end

  def create
    game = Game.create(game_params)
    render json: game
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
    render json: game
  end

  private

    def game_params
      params.require(:game).permit(:state => [])
    end

end
