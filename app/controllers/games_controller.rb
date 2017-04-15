class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def create
    # binding.pry
    @game = Game.new

  end

end