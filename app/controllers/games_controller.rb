class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    @games = Game.all
    render json: @games.to_json, :layout => false
  end

  def new
    @game = Game.new
  end

  def show
    render plain: @game.state, :layout => false
  end

  def create
    @game = Game.create(game_params)
    render json: @game.to_json, :layout => false
  end

  def update
    @game.update(game_params)
  end

  private

    def game_params
      params.require(:game).permit(:state)
    end

    def set_game
      @game = Game.find_by(id: params[:id])
    end

end
