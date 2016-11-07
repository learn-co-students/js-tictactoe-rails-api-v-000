class GamesController < ApplicationController

	def index
		@games = Game.all
		respond_to do |f|
			f.json { render :json => @games }
			f.html { render :index }
		end
	end

	def new
		@game = Game.new
	end

	def create
		@game = Game.create(state: params["game"]["state"])
		render json: @game, status: 201
	end

	def update
		@game = Game.update(state: params["game"]["state"])
		render json: @game, status: 200
	end

	private
		def game_params
			params.require(:game).permit(:state)
		end

end
