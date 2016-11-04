class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def show
    @game = Game.find_by(id: params[:id])
    render json: @game
  end

  def create
    @game = Game.create(state: params[:game][:state])
    render json: @game
  end

  def update
    @game = Game.find_by(id: params[:id])
    @game.update(state: params[:game][:state])
    render json: @game
  end


end
