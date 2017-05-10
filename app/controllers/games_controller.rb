class GamesController < ApplicationController
  def create
    @game = Game.create(state: params[:game][:state])
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:game][:state])
  end

  def index
    @games = Game.all
    render json: @games
  end
end
