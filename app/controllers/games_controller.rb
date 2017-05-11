class GamesController < ApplicationController
  def index
    games = Game.all
    render json: games
  end

  def create
    new_game = Game.create(state: game_params[:state])
    #byebug
    render json: new_game
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def edit
    @game = Game.find(params[:id])
    @game.update(state: game_params['state'])
    status = @game.save
    render json: {saved: status}.to_json
  end

  def game_params
    params[:game]
  end

end