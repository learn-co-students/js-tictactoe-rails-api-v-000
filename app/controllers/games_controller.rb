class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def create
    gameState = params["game"]["state"]
    @game = Game.create(state: gameState)
    render json: @game
  end

  def update
    gameState = params["game"]["state"]
    @game = Game.find(params[:id])
    @game.update(state: gameState)
    render json: @game
  end

end