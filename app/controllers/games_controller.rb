class GamesController < ApplicationController

  def index
    # displays all games played
    @games = Game.all
    render json: @games
  end

  def create
    # creates a new game
    @game = Game.create(game_params)
    render json: @game
  end

  def update
    # updates a played game
    @game = Game.find(params[:id])
    @game.update(game_params)
    @game.save
    render json: @game
  end

  private

  def game_params
    # allow user to start with an empty game
    params.require(:game).permit(state: [])
  end
end
