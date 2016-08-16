class GamesController < ApplicationController

  before_action :find_game, only: [:show, :update]

  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.new(game_params)
    if @game.save
      render json: @game, status: 201
    else
      render json: { errors: @game.errors.full_messages }
    end
  end

  def show
    render json: @game
  end

  def update
    @game.update(game_params)
  end

  private

  def find_game
    @game = Game.find(params[:id])
  end

  def game_params
    params.require(:game).permit(state: [])
  end

end
