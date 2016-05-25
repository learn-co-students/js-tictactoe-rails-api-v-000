class GamesController < ApplicationController

    def index
       @games = Game.all
       render json: @games
    end

    def create
      @game = Game.create()
      @game.state = game_params
      @game.save
      render json: @game
    end
    
    def show
       @game = Game.find(params: :id) 
       render json: @game
    end
    
    def update
        @game = Game.find(params: id)
        @game.state = params[:game][:state]
        @game.save
        render json: @game
    end
    
    
    def game_params
        params.require(:game).permit(:state)
    end
    
end