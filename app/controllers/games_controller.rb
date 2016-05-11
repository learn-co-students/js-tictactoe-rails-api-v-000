class GamesController < ApplicationController


  def index
    @games=Game.all
    render json: @games
  end

  def create
# byebug
    @game=Game.create(state: params["state"])
    render json: @game
  end


  def update
  # byebug
    @game = Game.find_by(id: params[:id])
    @game.update(state: params["game"]["state"])
    render json: @game
  end

end
