class GamesController < ApplicationController
	before_action :set_game, only: [:show, :update]

	def index
		@games = Game.all
		render json: @games
	end

	def new
		@game = Game.new
	end

  def update
  	@game.update(game_params)
  end

  def show
    render json: @game
  end

  def create
  	@game = Game.create
  	Game.count += 1
    render json: @game
  end

  private

  def game_params
  	params.require(:game).permit(:id, :state)
  end

  def set_game
    @game = Game.find(params[:id])
  end
end
