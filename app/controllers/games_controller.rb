class GamesController < ApplicationController

  def create
    game = Game.create(state: params[:state])
    render json: game, status: 201
  end

  def update
    game = Game.find(params[:id])
    game.state = params[:state]
    game.save
    render json: game, status: 200
  end

  def index
    @games = Game.all
    render json: @games
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, status: 200
  end

end
