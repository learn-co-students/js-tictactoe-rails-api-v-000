class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.new(game_params)
    if @game.save
      # render layout: false
      render json: @game
    end
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def update
    @game = Game.find(params[:id])
    # binding.pry
    @game.update(game_params)
    render json: @game
  end


  private

  def game_params
    params.require(:game).permit(:state => [])
  end


end
