class GamesController < ApplicationController
  def index
    @games = Game.all.map(&:id)
    render json: @games, status: 201
  end

  def create 
    @game = Game.create(state: params["board"].split(''))
    render json: @game, status: 201
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, status: 201
  end

  def update
  end

  private

  def game_params
    params.require(:board)
  end
end
