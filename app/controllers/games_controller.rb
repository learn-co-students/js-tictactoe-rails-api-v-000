class GamesController < ApplicationController

	# GET /games
	def index
		@games = Game.all
		render json: @games
	end

	# POST /games
	def create
		@game = Game.create(game_params)
		render json: @game, status: 200
		# https://httpstatuses.com/201 SUCCESS CREATED
		# "The request has been fulfilled and has resulted in one or more new resources being created."
	end

	# PATCH /games/:id
	def update
		@game = Game.find(params[:id])
		@game.update(state: params[:game][:state])
		render json: @game, status: 200
		# 204 ? "The server has successfully fulfilled the request and that there is no additional content to send in the response payload body."
	end

	private

		# {"game"=>{"state"=>["X", "O", "", "", "", "", "", "", ""]}}
		def game_params
			params.require(:game).permit(state: [])
		end

end 