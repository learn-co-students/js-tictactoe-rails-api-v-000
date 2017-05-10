class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.create(state: params[:state])
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:state])
    render json: @game
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end 



end
