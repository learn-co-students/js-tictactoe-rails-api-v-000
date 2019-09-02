class HomeController < ApplicationController
  def index
    
    @currentGameNumber = Game.all.last.id + 1
  end
end
