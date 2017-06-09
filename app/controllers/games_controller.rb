class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def new
    @game = Game.new(["", "", "", "", "", "", "", "", ""])
  end

  def create
    @game = Game.create(game_params)
    redirect_to root_path
  end

  def edit
    @game = Game.find(params[:id])
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end
end
