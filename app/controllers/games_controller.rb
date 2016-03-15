class GamesController < ApplicationController

  def index
    #render json: Game.all.as_json(only: [:id, :state])
    render json: Game.all
    #respond_to do |format|
    #  format.html { render json: Game.all.to_json(root: true, only: [:id, :state]) }
    #  format.json { render json: Game.all.to_json(root: true, only: [:id, :state]) }
    #end
  end

  def create
    #binding.pry
    Game.create(game_params)
    #respond_to do |format|
    #  format.json { Game.create(JSON.parse(params)["game"]) }
    #end
  end

  def update
    #binding.pry
    game = Game.find(params[:id])
    game.update(game_params)
    game.save

  end

  private

  def game_params
    params.require(:game).permit(state: []);
  end

end
