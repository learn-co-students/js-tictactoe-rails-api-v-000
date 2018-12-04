class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index #GET /games
    games = Game.all
    render json: games
  end

  def show #GET /games/:id
    # @game = Game.find(params[:id])
    render json: @game
  end

  def create #POST /games
    game = Game.create(game_params)
    render json: game, status: 201
  end

  def update #PATCH /games/:id
    # @game = Game.find(params[:id])
    @game.update(game_params)
    render json: @game
  end

  private

  def game_params
    params.permit(state: [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end
