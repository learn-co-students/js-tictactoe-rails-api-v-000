class GamesController < ApplicationController

  def create
    @game = Game.new(game_params)
    @game.save
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update_attributes(game_params)
  end

  def index
    @games = Game.all
    render json: @games
  end

  private

  def game_params
    params.require(:game).permit({:state => []})
  end

end
