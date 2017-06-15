class GamesController < ApplicationController

  def create
    # binding.pry
    @game = Game.create(game_params)
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
    render json: @game
  end

  def index
    @games = Game.all
    render json: @games
  end


  private

  def game_params
    params.require(:game).permit( :state => [])
  end

end