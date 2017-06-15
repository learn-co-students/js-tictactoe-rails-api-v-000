class GamesController < ApplicationController

  #uses ActiveModel Serializer to implicitly serialize game (render json: @game), in serializers/game_serializer.rb
  #generated using: bundle exec rails g serializer game
  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
    render json: @game
  end

  #-------------------------------
  private

  def game_params #strong params
    params.require(:game).permit(state: [])
  end
end
