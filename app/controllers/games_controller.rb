class GamesController < ApplicationController 

  def index
    @games = Game.all
    render json: @games

  end

  def new

  end


  def create
 
    @game = Game.create(state: params[:state])

    render json: @game, status: 201
    


  end

  def edit

  end


  def update


  end



  private

  

end