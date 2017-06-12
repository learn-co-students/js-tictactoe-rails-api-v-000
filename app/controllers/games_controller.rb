class GamesController < ApplicationController

  def create
    Game.create(state: ['', '', '', '', '', '', '', '', ''])
  end

  def update
    # binding.pry
    game = Game.find(params[:id])
    game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit(state:[])
  end

end
