class GamesController < ApplicationController

  before_action :set_state, only: [:show, :update, :destroy]

  def index
    games = Game.all
    render json: games
  end

  def create
    game = Game.create(state_params)
    render json: game, status: 201
  end

  def show
    render json: @game
  end

  def update
    @game.update(state_params)
  end

  private
    def set_state
      @game = Game.find(params[:id])
    end

    def state_params
      params.require(:game).permit(:id, state: [])
    end

end
