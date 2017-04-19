class GamesController < ApplicationController

  def index 
    @games = Game.all
    render json: @games
  end 

  def create 
    @game = Game.create(state: params[:state])
    render json: @game
  end 




end 
