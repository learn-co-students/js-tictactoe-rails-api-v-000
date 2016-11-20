class GamesController < ApplicationController
  before_action :set_state, only: [:update, :destroy]

  def index
    @games = Game.all
  end

  def create
    binding.pry
    game = Game.new
    game.create(state_params)
  end

  def update
    @game.update(state_params)
  end

  def destroy
    @game.destory
  end

  private
    def set_state
      @game = Game.find(params[:id])
    end

    def state_params
      params.require(:game).permit(state: [])
    end
end
