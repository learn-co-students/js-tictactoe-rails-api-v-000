class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :delete]

  def index
    @games = Game.all
    render json: @games.to_json
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
    render json: @game
  end
  
  private

  def game_params
    params.require(:game).permit(state: [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end
