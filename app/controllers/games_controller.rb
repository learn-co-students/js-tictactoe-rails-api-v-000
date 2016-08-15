class GamesController < ApplicationController 

  def index
    @games = Game.all
    render json: @games

  end

  def new

  end

  def show 
 
    @game = Game.find(params[:id])
    render json: @game
  end


  def create
 
    @game = Game.create(state: params[:state])

    render json: @game, status: 201
    


  end

  def edit

  end


  def update
    
    @game = Game.find(params[:id])
   
    @game.update(state: params[:state])
    render json: @game

  end



  private

  

end