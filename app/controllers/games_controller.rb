class GamesController < ApplicationController

  def index
    @games = Game.select("id, state").all
    render json: @games, status: 201
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, status: 201
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.create(state: params[:game][:state])
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:game][:state])
    render json: @game, status: 201
  end


  # private
  #
  #   def game_params
  #     params.require(:game).permit(:state)
  #   end
end
