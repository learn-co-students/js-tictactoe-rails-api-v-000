class GamesController < ApplicationController

  def index
    @games = Game.all
  end

  def new
    game = Game.new
  end

  def create
    game = Game.create
    render json: game, status: 201
  end

end
