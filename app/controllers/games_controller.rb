class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games.as_json(:except => [:created_at, :updated_at]), status: 201
  end

  def create
    @game = Game.create(game_params)
  end

  def update
    @game = Game.find(params['id'])
    @game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit!
  end

end
