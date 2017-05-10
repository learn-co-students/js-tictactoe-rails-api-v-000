class GamesController < ApplicationController 
  def index 
    @games = Game.all;
    render :json => @games 
  end

  def create
    Game.create(state: params[:game][:state])
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:game][:state])
  end

  def game_params
    params.require(:game).permit(:state)
  end
end
