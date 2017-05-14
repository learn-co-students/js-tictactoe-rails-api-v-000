class GamesController < ApplicationController

  def index
      games = Game.all
      render json: {games: games.as_json(only: [:id, :state])}
    end

    def new
      game = Game.new
    end

    def create
      game = Game.create(game_params)
    end

    def show
      game = Game.find(params[:id])
      render json: game
    end

    def edit
      game = Game.find(params[:id])
    end

    def update 
      game = Game.find(params[:id])
      game.update(game_params)
      game.save
      render json: game
    end

    private

      def game_params
        params.require(:game).permit(state: [])
      end

end