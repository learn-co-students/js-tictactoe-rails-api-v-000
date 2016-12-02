class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: @games
  end

  def create
    @game = Game.create(game_params)
    render json: @game, status: 201
  end

  def update
    @game = Game.find(params[:id])
    @game.state = game_params["state"]
    @game.save
    render json: @game
  end

  def destroy

  end

  def show
    @game = Game.find(params[:id])
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @game.to_json }
    end
  end

  private

  def game_params
    params.require(:game).permit(:state => [])
  end

end
