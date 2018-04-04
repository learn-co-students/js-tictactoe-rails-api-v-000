class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    games = Game.all
    render json: games
  end

  def show
    render json: @game
  end

  def create
    game = Game.create(game_params)
    # so this sends back info but what am i supposed to do with it? and how do i see it?
    render json: game, status: 201
  end

  def update
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
