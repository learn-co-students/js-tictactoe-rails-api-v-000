class GamesController < ApplicationController
  def create
    game = Game.create(games_params)
  end

  def index
    @games = Game.all
    render json: @games
  end

  def update
    game = Game.find_by(id: params[:id])
    game.update(state: params[:game][:state])
  end

  private
    def games_params
      params.require(:game).permit(:state)
    end
end
