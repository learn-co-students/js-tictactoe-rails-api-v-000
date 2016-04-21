class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def create
    game = Game.create(state: game_params[:state])
    render json: game
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def edit
    @game = Game.find(params[:id])
    @game.update(state: game_params['state'])
    saved_game = @game.save
    render json: {saved: saved_game}.to_json
  end

  private
    def game_params
      params[:game]
    end
end