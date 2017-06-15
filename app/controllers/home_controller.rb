class HomeController < ApplicationController

  def index
    @state = ["J", "", "", "", "", "", "", "", "K"]
  end

 

private

  def current_game
    @game = Game.find(params[:id])
  end

end