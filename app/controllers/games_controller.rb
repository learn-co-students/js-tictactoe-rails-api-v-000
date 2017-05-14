class GamesController < ApplicationController

 def index
    @games = Game.all
    render json: @games, status: 201
  end

  def create
    @game = Game.create(game_params)
    render json: game, status: 201
  end

  def update
    game = Game.find(params[:id])
    @game.update(game_params)
    render json: game, status: 200
  end

  def show
    @game = Game.find(params[:id])
    render json: @game

  private

  def game_params
    params.require(:game).permit( {state: []} )
  end

end

end
