class GamesController < ApplicationController
	def index 
	end

	def create
		game = Game.create(state: ["", "", "", "", "", "", "", "", ""])
	end

	def update
		game = Game.find(params[:id])
		game.state = params[:state]
		game.save
	end

end
