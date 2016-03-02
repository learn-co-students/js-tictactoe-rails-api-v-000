class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def new 
    @game = Game.new
  end

  def create 
    @game = Game.create(game_params)
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
  end

  def destroy
    Game.find(params[:id]).destroy
  end


  private

  def game_params
    params.require(:game).permit({:state => []})
  end



end ## class end
