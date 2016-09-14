class GamesController < ApplicationController
    
    
    def index
        
        @games = Game.all
        render json: @games

    end
    
    def create
        @game = Game.new(game_params)
        @game.save
    end
    
    def update
        @game = Game.find(params[:id])
        @game.update(game_params)
    end
    
    private
    
    def game_params
        params.require(:game).permit(state: [])
    end
    
end
