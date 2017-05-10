class GamesController < ApplicationController

  def index
    games = Game.all
    #need to use as_json instead of to_json
    @games = {"games" => games.as_json(only: [:id, :state])}
    render json: @games
  end

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
    render json: @game
  end

  private

  def game_params
    params.require(:game).permit(state: [])
  end

end