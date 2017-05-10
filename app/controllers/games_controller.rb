# class GamesController < ApplicationController
#
#   def index
#     @games = Game.all
#   end
#
#   def create
#     @game = Game.create(game_params)
#     render json: @game, status: 201
#   end
#
#   def update
#     game = Game.find(id: params[:id])
#     game.state = game_params[:state]
#     game.save
#     render json: game, status: 201
#   end
#
#   def destroy
#   end
#
#   private
#
#   def game_params
#     params.require(:game).permit(state: [])
#   end
#
# end


class GamesController < ApplicationController

  def index
    @games = Game.all
    render json: @games.as_json(except: [:created_at, :updated_at])
  end

  def show
    @game = Game.find[params[:id]]
    render json: @game
  end

  def create
    game = Game.new(game_params)
    game.save
    render json: game, status: 201
  end

  def update
    game = Game.find(params[:id])
    game.update(game_params)
  end

  private

  def game_params
    params.require(:game).permit({state: []})
  end

end
