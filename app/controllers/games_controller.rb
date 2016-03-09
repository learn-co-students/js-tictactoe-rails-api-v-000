class GamesController < ApplicationController

  def create
    game = Game.create
  end

  def index
    games = Game.all
    render json: games
  end

  def update
    game = Game.find(params[:id])
    game.state = params[:state]
    game.save
  end
end
