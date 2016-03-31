class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    @games = Game.all
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @games}
    end
  end

  def show
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @game}
    end
  end

  def create
    Game.create(state: params[:game][:state])
  end

  def update
    @game.update(state: params[:game][:state])
  end

  # def destroy
  #   @game.destroy
  # end

  private

  def set_game
    @game = Game.find(params[:id])
  end

  

end