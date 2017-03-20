class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.create()
    @game.state = [" ", " ", " ", " ", " ", " ", " ", " ", " ", ]
    @game.save
  end

  def update
    @game = Game.find(params[:id])
    @game.state = params[:game][:state]
    @game.save
  end
end
