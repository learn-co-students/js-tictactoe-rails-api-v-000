class GamesController < ApplicationController
  def new
    @game = Game.new
  end

  def create
    @game = Game.create(state: game_params)
    render json: @game, status: 201
  end

  def update
    @game = Game.find_by(id: params[:id])
    @game.update(state: game_params)
    render json: @game, status: 201
  end

  def index
    @games = Game.all
    render json: {games: @games.as_json(except: [:created_at, :updated_at])}
  end

  def show
    @game = Game.find_by(id: params[:id])
    render json: @game
  end

  private
  def game_params
    params.require(:game).require(:state)
  end
end
