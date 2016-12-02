class GameController < ApplicationController

  def create
    @game = Game.create(game_params)
    render 'home/index'
    # render json: @game, status: 201
  end

  def index
    @games = Game.all
 	  render json: @games.to_json(only: [:id, :state, :done]), status: 200
  end

  def update
    @game = Game.find_by_id(params[:game][:id])
    @game.update(game_params)
    render 'home/index'
  end



  def game_params
      params.require(:game).permit(:state, :id, :done)
    end

end
