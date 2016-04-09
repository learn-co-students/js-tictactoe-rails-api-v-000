class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games, status: 200
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, status: 200
  end

  def create
    @game = Game.create(state: params["game"]["state"])
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params["game"]["state"])
    render json: @game, status: 201
  end
end
