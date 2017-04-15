class GamesController < ApplicationController
  before_action :set_game, only: %i[show update]

  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.new
    @game.state = params[:state]
    @game.turn = params[:turn]
    @game.save
    render json: @game
  end

  def show
    render json: @game
  end

  def update
    @game.update(state: params[:state], turn: params[:turn])
    render json: @game
  end

  private

  def set_game
    @game = Game.find(params[:id])
  end

end
