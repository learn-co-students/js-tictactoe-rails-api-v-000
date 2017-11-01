class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    games = Game.all
    render json: games
  end

  def show    
    render json: @game
  end

  def create
    game = Game.create(game_params)
    if game.save
      render json: game, status: 201
    end
  end

  def update
    @game.update(game_params)
    render json: @game 
  end
  
  def reset
    %x[rake db:dcms]
    @games = Game.all 
    render json: @games
  end
  
  private
  
  def game_params
    params.permit(:id, state: [])
  end

  def set_game
    @game = Game.find(params[:id])
  end
end