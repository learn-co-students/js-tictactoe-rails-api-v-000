class GamesController < ApplicationController

	def index
		@games = Game.all
		render json: @games
	end

	def create
		@game = Game.create(game_params)
		respond_to do |format|
      format.json { render json: @game }
    end
	end

	def update
		@game = Game.find(params[:id])
    @game.update(game_params)
    respond_to do |format|
      format.json { render json: @game }
    end
	end

	private

	def game_params
		params.require(:game).permit(:id, :state => [])
	end

end