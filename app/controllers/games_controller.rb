class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games, status: 201
  end

  def create
    @game = Game.create(state: params[:state])
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:state])
    @game.save
    render json: @game, status: 201
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  private

    def game_params
      params.require(:game).permit(:state)
    end

end
