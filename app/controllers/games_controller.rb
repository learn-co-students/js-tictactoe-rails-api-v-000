class GamesController < ApplicationController

  def create
    Game.create(state: ['', '', '', '', '', '', '', '', ''])
  end

  def update
  end

end
