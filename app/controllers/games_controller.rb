class GamesController < ApplicationController

  def create
    @game = Game.create(game_params)
    render json: @game
  end

  def update
    @game = Game.update(params[:id], game_params)
    @game.save
    render json: @game
  end

  def index
    @games = Game.all
    render json: @games 
  end


  private
  def game_params
    params.require(:game).permit(:state => [])
  end
end
