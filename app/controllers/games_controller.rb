class GamesController < ApplicationController

  def index
    games = Game.all
    render json: games
  end

  def create
    game = Game.new(state: params[:state])
    game.save
    render json: game
  end

  def update
    game = Game.find_by(id: params[:id])
    game.update(game_params)
  end


  private

    def game_params
      params.require(:game).permit(:state => [])
    end

end
