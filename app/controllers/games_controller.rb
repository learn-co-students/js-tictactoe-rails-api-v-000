class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :delete]

  def index
    @games = Game.all
    respond_to do |f|
      f.html { redirect_to root_path }
      f.json { render json: @games, status: 200 }
    end
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def update
    @game.update_attributes(game_params)
    render json: @game, status: 202
  end

  def show
    respond_to do |f|
      f.html
      f.json { render json: @game }
    end
  end

  private

  def game_params
    params.require(:game).permit(state: [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end
