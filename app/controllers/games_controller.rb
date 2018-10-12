class GamesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_game, only: [:show, :update, :destroy]

  def index
    games = Game.all
    render json: games
  end

  def show
    render json: @game
  end

  def create
    game = Game.create(state: params["state"])
    render json: game, status: 201
  end

  def update
    @game.update(state: params["state"])
    render json: @game
  end

  def destroy
    @game.delete
    render "home/index"
  end

  private

  def game_params
    params.require(:game).permit(:state, :id, :game)
  end

  def set_game
    @game = Game.find(params[:id])
  end
end
