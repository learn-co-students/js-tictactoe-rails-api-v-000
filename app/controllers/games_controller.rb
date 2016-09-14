class GamesController < ApplicationController

  def create
    @game = Game.create(game_params)
    render json: @game, status: 200
  end

  def update
    @game = Game.find(params[:id])
    puts @game
    @game.update(state: params[:game][:state])
    render json: @game, status: 200
  end

  def index
    @games = Game.all
    render json: @games, status: 200
  end
end

private
def game_params
  params.require(:game).permit(:id, :state => [])
end
