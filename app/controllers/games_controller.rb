class GamesController < ApplicationController

    def index
       @games = Game.all
       render json: @games
    end

    def create
      @game = Game.create()
      @game.state = params[:game][:state]
      @game.save
      render json: @game
    end

    def show
       @game = Game.find_by(id: params[:id])
       puts @game.state
       render json: @game
    end

    def update
        @game = Game.find(params: id)
        @game.state = params[:game][:state]
        @game.save
        render json: @game
    end


    def board_params
        params.require(:game).permit(:state)
    end

end
