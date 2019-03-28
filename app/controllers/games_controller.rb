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
    board = JSON.parse(params.permit(:state)["state"])
    game = Game.create(:state => board)
    render json: game, status: 201
  end

  def update
    
    board = JSON.parse(params.permit(:state)["state"])
    @game.update(:state => board)
    render json: @game
  end

  private

  def game_params
    params.permit(:state)
  end

  def set_game
    @game = Game.find(params[:id])
  end
end