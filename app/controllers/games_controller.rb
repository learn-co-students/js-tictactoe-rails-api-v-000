class GamesController < ApplicationController

	def index
		@games = Game.all
		render json: @games
	end

	def create
		@game = Game.new(state: params[:game][:state])
    if @game.save
      render json: @game, status: 201
    else
      render json: @game.errors, status: :unprocessable_entity
    end		
	end

	def update
		@game = Game.find(params[:id])
		if @game.update(state: params[:game][:state])
			render json: @game, status: 201
		else
			render json: @game.errors, status: :unprocessable_entity
		end
	end

end