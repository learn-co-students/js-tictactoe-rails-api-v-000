class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    games = Game.all
    render status: 200, json: games
  end

  def show
    render json: @game
  end

  def create
    game = Game.create(game_params)
    render status: 201, json: game
  end

  def update
    # @game = Game.find(params[:game_id])
    @game.update(game_params)
    render status: 200, json: @game
  end

  private

  def game_params
    params.permit(state: [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end