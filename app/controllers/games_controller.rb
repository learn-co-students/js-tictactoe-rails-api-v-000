class GamesController < ApplicationController

  def index
    @games = Game.all

    respond_to do |f|
      f.json { render json: @games }
    end
  end

  def create
    @game = Game.create(game_params)

    respond_to do |f|
      f.json { render json: @game }
    end
  end

  def update
    @game = Game.update(params[:id], game_params)
    @game.save
    
    respond_to do |f|
      f.json { render json: @game }
    end
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end

end