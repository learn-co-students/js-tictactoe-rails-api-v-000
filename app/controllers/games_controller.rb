class GamesController < ApplicationController
  # Lists all games
  def index
    games = Game.all
    response = {games: games}
    render json: response.as_json(except: [:created_at, :updated_at])
  end

  # Creates a new game
  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  # Updates an existing game
  def update
    @game = Game.find(params[:id])
    @game.update(state: params["game"]["state"])
    render json: @game, status: 201
  end

  private

  def game_params
    params.require(:game).permit(:state)
  end
end
