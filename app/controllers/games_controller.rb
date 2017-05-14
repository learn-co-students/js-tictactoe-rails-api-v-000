class GamesController < ApplicationController

  before_action :set_game, only: [:update, :show]

  def index
    @games = Game.all
    render json: @games, status: 200 
  end

  def create
   #binding.pry
    @game = Game.create(state: params["state"])
    render json: @game, status: 201
  end


  def update
    #binding.pry
    @game.update(state: params["state"])
    render json: @game, status: 201
  end

  def show
    render json: @game, status: 200
  end

  private

    def set_game
      @game = Game.find(params[:id])
    end


  

end