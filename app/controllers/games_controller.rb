class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.create(state: params["game"]["state"])
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.state =  params[:game][:state]
    @game.save
    render json: @game
  end

end
