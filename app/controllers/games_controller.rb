class GamesController < ApplicationController
  def index
    #binding.pry
  end

  def create
    @game = Game.create(state: params[:state])
    @currentGame = @game.id
    render text: @game.id
  end

  def update
    binding.pry
  end
  
end
