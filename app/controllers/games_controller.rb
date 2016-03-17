require 'pry'

class GamesController < ApplicationController
  def show
    @game = Game.find(params[:id])
    respond_to do |format|
      format.json { render json: @game.state}
    end
  end


  def create
    binding.pry
    if params['new_game']
      Game.create(state: params['status'])
    else
      game = Game.find_by(id: params[:id]-1)
      if game.nil?
        game.state = params['status']
        game.save
      end
    end

  end

  def last
    @game = Game.last
    respond_to do |format|
      format.json { render json: @game.id}
    end
  end

end
