class GamesController < ApplicationController

	def index
		@games = Game.all
		render json: @games
	end

	def create
		@game = Game.new(game_params)
    if @game.save
      render json: @game, status: 201
    else
      render json: @game.errors, status: :unprocessable_entity
    end		
	end

	def update
		@game = Game.find(params[:id])
		if @game.update(game_params)
			render json: @game, status: 201
		else
			render json: @game.errors, status: :unprocessable_entity
		end
	end

	private

		def game_params
			params.require(:game).permit(state: [])
		end
end