class GamesController < ApplicationController
  def index
    #@games = []
    #Game.all.each do |game|
    #  @games << game.id
    #end
    #binding.pry
    #render text: @games;
    render json: Game.all
  end

  def create
    @game = Game.create(state: params[:game][:state])
    @currentGame = @game.id
    render text: @game.id
  end

  def update
#    binding.pry
    @game = Game.find(params[:id]);
    @game.update(state: params[:game][:state]);
#    binding.pry
  end
  
  def show
    @game = Game.find(params[:id]);
    render text: @game.state
    #binding.pry
  end
  
end
