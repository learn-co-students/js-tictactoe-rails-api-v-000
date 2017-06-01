class GamesController < ApplicationController
  def index
    @games = []
    Game.all.each do |game|
      @games << game.id
    end
#    binding.pry
    render text: @games;
  end

  def create
    @game = Game.create(state: params[:state])
    @currentGame = @game.id
    render text: @game.id
  end

  def update
    @game = Game.find(params[:id]);
    @game.update(state: params[:state]);
  end
  
  def show
    @game = Game.fine(params[:id]);
    binding.pry
  end
  
end
