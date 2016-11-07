class GamesController < ApplicationController

	def index
		@games = Game.all
		render json: @games.to_json(only: [:id, :state]), status: 200
	end

	def new
		@game = Game.new
	end

	def create
		@game = Game.create(state: params["game"]["state"])
		render json: @game, status: 201
	end

	def update
		@game = Game.find(params[:id])
		@game.update(state: params["game"]["state"])
		render json: @game, status: 200
	end

	private
		def game_params
			params.require(:game).permit(:state)
		end

end
