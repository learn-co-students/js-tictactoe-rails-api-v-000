class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def new

  end

  def create
    game = Game.create(state: params[:game][:state].to_s)
    render json: game, status: 201
  end

  def show
    game = Game.find(params[:id])
    render json: game, status: 201
  end

  def edit

  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
    render json: game, status: 201
  end

  private
    def game_params
      params.require(:game).permit({ state: [] })
    end
end
