class GamesController < ApplicationController
  before_action :set_game, only: [:update, :edit]

  def index
    @games = Game.all
    render json: @games
  end

  def new
    @game = Game.new(["", "", "", "", "", "", "", "", ""])
  end

  def create
    @state = JSON.parse(params[:state])    
    @game = Game.create(state: @state)   
    render json: @game, status: 201
    redirect_to root_path
  end

  def edit

  end

  def update
    @game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end
