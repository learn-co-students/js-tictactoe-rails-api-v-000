class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games, status: 201
  end

  def create
    @game = Game.new(game_params)
    @game.save
    render json: @game, status: 201
  end

  def update
    @game = Game.find_by(id: params[:id])
    @game.update(game_params)
    render json: @game, status: 201
  end

  private
    def game_params
      params.require(:game).permit(:state => [])
    end

end
