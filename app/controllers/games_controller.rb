class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def new

  end

  def create
    binding.pry
    game = Game.create(game_params)
  end

  def show

  end

  def edit

  end

  def update

  end

  def destroy

  end

  private
    def game_params
      params.require(:game).permit( {state: [] } )
    end
end
