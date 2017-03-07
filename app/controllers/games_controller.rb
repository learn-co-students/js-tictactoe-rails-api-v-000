require 'pry'

class GamesController < ApplicationController

  def index
    #render json list of all games
    @games = Game.all
    render json: @games, status: 200
  end

  def create
    #create game with json params, passed here
    binding.pry
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  # def destroy
  #   #destroy game with params
  #   @game = Game.find_by(id: params[:id])
  #   @game.destroy
  #   redirect_to games_path
  # end

  def update
    #if game exists, pass here to update state
    @game = Game.find_by(id: params[:id])
    @game.update(game_params)
    render json: @game, status: 201
  end

  private

  def game_params
    params.require(:game).permit(:id, :state=>[])
  end

end
