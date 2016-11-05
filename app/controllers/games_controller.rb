class GamesController < ApplicationController

	def index
		@games = Game.all
	end

	def new
		@game = Game.new
	end

	def create
		@game = Game.create(game_params)
		render json: @game, status: 201
	end

	def update
		@game = Game.update(game_params)
		render json: @game, status: 200
	end

	private
		def game_params
			params.require(:game).permit(:state)
		end

end
