class GamesController < ApplicationController

  def create
    @game = Game.create(game_params)
  end

  def index
  end

  def update
  end  

  private

    def game_params
      params.require(:game).permit(:state)
    end  

end