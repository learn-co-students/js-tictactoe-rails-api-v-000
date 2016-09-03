class GamesController < ApplicationController

  def index
    # binding.pry
    @games = Game.all
    render json: @games.as_json(:except => [:created_at, :updated_at]), status: 201
  end

  def show
    # binding.pry
    @game = Game.find(params[:id])
    render json: @game 
  end

  def create
    # binding.pry
    # might have to modify to reflect params['game']['state']
    @game = Game.create(state: params['game']['state'])
    render json: @game, root: true
  end

  def update
    # binding.pry
    @game = Game.find(params['id'])
    @game.update(state: params['game']['state'])
  end

  private

  # def game_params
    # params.require(:game).permit!
  # end

end
