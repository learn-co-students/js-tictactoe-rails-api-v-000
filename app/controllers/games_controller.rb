class GamesController < ApplicationController
  before_action :set_game, only: [:update, :show]

  def index
    @games = Game.all
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @games}
    end
  end

  def show
    @game = Game.find(params[:id])
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @game}
    end
  end

  def create
    @game = Game.create(state: params[:game][:state])
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @game}
    end
  end

  def update
    @game.update(state: params[:game][:state])
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @game}
    end
  end

  def destroy
  end

  private

  def set_game
    @game = Game.find(params[:id])
  end
end
