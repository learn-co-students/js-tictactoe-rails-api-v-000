class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :delete]

  def index
    @games = Game.all
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def show
    respond_to do |f|
      f.html
      f.json { render json: @product}
    end
  end

  private

  def game_params
    params.require(:game).permit(:state)
  end

  def set_games
    @game = Game.find(params[:id])
  end
end
