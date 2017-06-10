class GamesController < ApplicationController
  before_action :set_game, only: [:update, :edit]

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

  end

  def update
    @game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end
