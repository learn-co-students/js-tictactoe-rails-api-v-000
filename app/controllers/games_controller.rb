class GamesController < ApplicationController

  def index
    # binding.pry
    @games = Game.all
    # render json: @games
    render json: GameSerializer.serializer_all(@games)
  end

  def create
    @game = Game.new(game_params)
    @game.save
    render json: GameSerializer.serializer(@game)
    # render json: @game
  end

  def show
    @game = Game.find(params[:id])
    render json: GameSerializer.serializer(@game)
    # render json: @game
  end

  def update
    @game = Game.find(params[:id])
    @game.update(game_params)
    render json: GameSerializer.serializer(@game)
    # render json: @game
  end


  private

  def game_params
    params.require(:game).permit(:state => [])
  end


end
