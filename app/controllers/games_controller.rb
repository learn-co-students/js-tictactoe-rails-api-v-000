class GamesController < ApplicationController

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def index
    @games = Game.all
    render json: @games, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
    render json: @game, status: 201
  end  

  private

    def game_params
      params.require(:game).permit(state: [])
    end  

end
