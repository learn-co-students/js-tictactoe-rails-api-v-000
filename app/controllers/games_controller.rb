class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

# get games_path
  def index
    games = Game.all
    render json: games
  end

# get game_path games/:id
  def show
    
    render json: @game
  end

# post games
  def create
    game = Game.create(game_params)
    render json: game, status: 201
  end

# put/patch game_path games/:id
  def update
    @game.update(game_params)
    render json: @game, status: 201
  end

  private

  def game_params
    params.permit(state: [])
  end

  def set_game

    @game = Game.find(params[:id])
  end
end
