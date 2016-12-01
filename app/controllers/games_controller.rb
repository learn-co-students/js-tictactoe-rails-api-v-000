class GamesController < ApplicationController
  def index

  end

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.state = game_params["state"]
    @game.save
    render json: @game
  end

  def destroy

  end

  def show
    @game = Game.find(params[:id])
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end

end
