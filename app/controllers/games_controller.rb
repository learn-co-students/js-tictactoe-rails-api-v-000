class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    games = Game.all
    render json: games, each_serializer: GameSerializer, key_transform: :unaltered
  end

  def show
    render json: @game, each_serializer: GameSerializer, key_transform: :unaltered
  end

  def create
    game = Game.create(game_params)
    render json: game, status: 201, each_serializer: GameSerializer, key_transform: :unaltered
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
