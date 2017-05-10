class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games
  end

  def show
    @game = Game.find_by_id(params[:id])
    render json: @game 
  end

  def create
    @game = Game.new
    @game.update(state: params[:state])
    @game.save
    render json: @game, status: 201
  end
  
  def update
    @game = Game.find(params[:id])
    @game.state = params[:game][:state]
    @game.save
    render json: @game, only: [:id, :state], status: 201
  end

  def demo
    Game.destroy_all
    ActiveRecord::Base.connection.execute("DELETE from sqlite_sequence where name = 'games'") 
    Game.create(state: ["O","X","O","X","X","","O","","O"])
    Game.create(state: ["X","O","O","","X","O","","X","O"])
    Game.create(state: ["","X","O","","X","X","","O","O"])
    redirect_to root_path
  end

  private
    def game_params
      params.require(:game).permit(:state)
    end
end
