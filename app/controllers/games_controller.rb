class GamesController < ApplicationController
  def index
    games = Game.all
    response = {games: games}
    render json: response.as_json(except: [:created_at, :updated_at])
  end

  def new
  end

  def show
  end

  def create
    @game = Game.new(game_params)
    render json: @game, status: 201
  end

  def edit
  end

  def update
    @game = Game.find(params[:id])
    @game.update(state: params[:game][:state])
    render json: @game, status: 201
  end

  private

    def game_params
      params.require(:game).permit(:state)
    end
end
