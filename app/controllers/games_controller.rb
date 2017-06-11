class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.create(game_params)
    render json: @game
  end

  def update
    @game = Game.update(params[:id], game_params)
    render json: @game
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def destroy
    Game.find(params[:id]).destroy
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end
end
