#require 'pry'
class GamesController < ApplicationController
  def create
    game = Game.create(id: params[:id], state: params[:game][:state])
  end

  def index
    games = Game.all
    render json: games
  end

  def update
    game = Game.find(params[:id])
    game.update(state: params[:game][:state])
    game.save
  end

  def show
    game = Game.find(params[:id])
    render json: game
  end

end
