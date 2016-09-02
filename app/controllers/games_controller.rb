class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games.as_json(:except => [:created_at, :updated_at]), status: 201
  end

  def create
    # binding.pry
    @game = Game.create(state: params['state'])
    render json: @game
  end

  def update
    @game = Game.find(params['id'])
    @game.update(params['state'])
  end

  private

  # def game_params
    # params.require(:game).permit!
  # end

end
