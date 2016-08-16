class GamesController < ApplicationController
  def index

  end

  def create
    game = Game.new
    game.save
  end

  def update
  end

end
