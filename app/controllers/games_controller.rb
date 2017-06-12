class GamesController < ApplicationController

  def index
    games = Game.all
    # respond_to do |f|
    #   f.json { render json: games }
    # end
    render json: games, root: "games"
  end

  def create
    Game.create(state: ['', '', '', '', '', '', '', '', ''])
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit(state:[])
  end

end
