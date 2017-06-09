class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.new
    @game.state = params[:state]
    render json: @game
  end
end
