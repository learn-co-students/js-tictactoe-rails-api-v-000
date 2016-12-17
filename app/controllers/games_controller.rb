class GamesController < ApplicationController

  def index
    # displays all games played
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
    params.require(:game).permit({state: []})
  end
end
