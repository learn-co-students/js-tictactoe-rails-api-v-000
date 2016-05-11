class GamesController < ApplicationController

  def index
    @games = Game.all 
    render json: @games
  end

  def create
    @game = Game.create
    @game.state = params[:game][:state]
    @game.save
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.state = params[:game][:state]
    @game.save
    render json: @game
  end

  private

  def game_params
    params.require(:game).permit(:state)
  end

end
