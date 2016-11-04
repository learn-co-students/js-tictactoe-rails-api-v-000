class GamesController < ApplicationController
	def index
		@games = Game.all
		render json: @games.to_json
	end

	def create
	    @game = Game.create(game_params)
	    render json: @game, status: 201
  	end

  	def update
  		@game = Game.find(params[:id])
  		@game.state = params[:game][:state]
  		@game.save
  		render json: @game, status: 200
  	end

	private
	def game_params
		params.require(:game).permit(:id, :state => [])
	end
end