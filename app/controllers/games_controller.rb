class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games.as_json(except: [:created_at, :updated_at])
  end

  def create
    @game = Game.new(game_params)
    @game.save
      render json: @game, status: 201
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
