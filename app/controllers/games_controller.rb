class GamesController < ApplicationController
  # Add your GamesController code here
  before_action :get_game, only: [:show, :update]
  before_action :all_games, only: :index

  def index
    render json: @games
  end

  def create
    @game = Game.create(game_params)
      render json: @game
  end

  def show
    render json: @game
  end

  def update
    @game.update(game_params)
    render json: @game
  end

  private
  def game_params
    params.permit(:state => [])
  end

  def get_game
    @game = Game.find_by(id: params[:id])
  end

  def all_games
    @games = Game.all
  end
end
