class GamesController < ApplicationController
  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def index
    @games = Game.all
    render json: @games
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
    render json: @game
  end

  def show
    @game = Game.find(params[:id])
    respond_to do |f|
      f.html { render :index }
      f.json { render json: @game}
    end
  end

  private

  def game_params
    params.require(:game).permit(:id, :state => [])
  end
end
