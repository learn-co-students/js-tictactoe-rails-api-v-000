class GamesController < ApplicationController
  before_action :set_game, only: [:show, :edit, :update, :destroy]

  def index
    render json: Game.all
  end

  def show
  	render json: @game
  end

  def create
    @game = Game.new(game_params)
    state = params[:game][:state]
    @game.state = state
    @game.save
    render json: @game
  end

  def update
  	state = params[:game][:state]
  	@game.update(state: state)
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
