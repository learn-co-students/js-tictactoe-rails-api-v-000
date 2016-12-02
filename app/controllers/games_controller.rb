require 'pry'
class GamesController < ApplicationController

  def create
    @game = Game.create(state: params["state"])
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params["state"])
    render json: @game
  end

  def index
    @games = Game.all
    render json: @games
  end
end
