require 'pry'
class GamesController < ApplicationController

  def index
    render json: Game.all
  end

  def show
    @game = Game.find(params[:id])
    respond_to do |f|
      f.html { render :show }
      f.json { render json: @game}
    end
  end

  def create
    @game = Game.create(game_params)
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit({state: []})
  end

end
