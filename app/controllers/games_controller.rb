require 'pry'
class GamesController < ApplicationController
  before_action :set_game, only: [:show, :update]

  def index
    @games = Game.all
    
    render json: @games
    
  end

  def show
    
    render json: @game
    
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