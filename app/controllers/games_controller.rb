class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    #binding.pry
    games = Game.all
    render json: games
  end

  def show
    render json: @game
  end

  def create
    #if set_game
    #  redirect_to action: 'update'
    #else
    binding.pry
    game = Game.create(game_params)
    render json: game, status: 201
    #end
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
