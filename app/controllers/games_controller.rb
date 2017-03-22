class GamesController < ApplicationController

	def index
      	@games = Game.all
		# respond_to do |format|
		# 	format.html { render :index }
		# 	format.json { render json: @games, status: 201}
		# end
		render json: @games
	end

	def create
		@game = Game.new
		@game.state = params["game"]["state"]
		@game.save
		render json: @game
	end


	def update
		@game = Game.find(params[:id])
		@game.state = params["game"]["state"]
		@game.save
		redirect_to games_path
	end

	def load
		@game = Game.find(params[:id])
		render json: @game
	end

	private

	def game_params
		params.require(:game).permit(:state)
	end
end
