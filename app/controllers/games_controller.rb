class GamesController < ApplicationController

  def index
    @games = Game.all
      render :json => @games.map { |game| {:id => game.id, :state => game.state} }
  end

  def create
    @game = Game.create(state: params[:game][:state])
    redirect_to game_path(@game)
  end

  def show
    @game = Game.find(params[:id])
    render json: @game, only: [:state, :id]
  end

  def update
    @game = Game.find_by(id: params[:id].to_i)
    @game.update(state: params[:game][:state])
  end
  
end
