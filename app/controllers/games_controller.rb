class GamesController < ApplicationController

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
    @game = Game.find(params[:id])
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
  end

  private
  def game_params
    params.require(:game).permit({state: []})
  end

end
