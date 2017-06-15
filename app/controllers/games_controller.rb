class GamesController < ApplicationController
  before_action :set_game, only: [:update, :show]

    def index
      @games = Game.all
      render json: @games
    end

    def new
      @game = Game.new
    end

    def show
      respond_to do |format|
        format.html { render :show }
        format.json { render json: @game}
      end
    end

    def create
      @game = Game.create(game_params)
      render json: @game, status: 201
    end

    def edit
    end

    def update
      @game.update(game_params)
      render json: @game
    end

  private
    def set_game
      @game = Game.find(params[:id])
    end

    def game_params
      params.require(:game).permit(:state)
    end

end
