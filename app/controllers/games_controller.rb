class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def new
    @game = Game.new
  end

  def create
    @game = Game.create(game_params)
    @game.state = params[:game][:state]
    @game.save
    render json: @game
  end

  def edit
    @game = Game.find(params[:id])
  end

  def update
    @game = Game.find(params[:id])
    @game.state = params[:game][:state]
    @game.save
    render json: @game
  end

  def destroy
    @game = Game.find(params[:id])
    @game.delete
  end

private

  def game_params
    params.require(:game).permit(:state, :game => {:state => []})
  end

end
