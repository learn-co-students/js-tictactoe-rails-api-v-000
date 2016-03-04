class GamesController < ApplicationController

  def create
    game = Game.create(state: params[:game][:state])
    render json: game
  end

  def update
    game = Game.find(params[:id].to_i)
    game.update(state: params[:game][:state])
    render json: game
  end

  def index
    games = Game.all
    render json: games
  end

  def show
    game = Game.find(params[:id].to_i)
    render json: game.to_json
  end
end
