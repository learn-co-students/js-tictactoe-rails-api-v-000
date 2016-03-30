class GamesController < ApplicationController
  before_action :set_game, only:[:update, :show]

def index
  @games = Game.all
  render json: @games
end

def create
  @game = Game.create(state: params[:game][:state])
  render json: @game
end

def update
  if !!@game
    @game.update(state: params[:game][:state])
    render json: @game
  end
end

def show
  render json: @game
end

private

  def set_game
    @game = Game.find(params[:id])
  end

end