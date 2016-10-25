class GamesController < ApplicationController

  def create
    @game = Game.new(game_params)
    @game.save
    respond_to do |format|
      format.json { render json: @game }
    end
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
    respond_to do |format|
      format.json { render json: @game }
    end
  end

  def index
    @games = Game.all
    render json: @games
  end

  private

  def game_params
    params.require(:game).permit(state: [])
  end

end
