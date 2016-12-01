class GamesController < ApplicationController
  def index

  end

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def update

  end

  def destroy

  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end

end
