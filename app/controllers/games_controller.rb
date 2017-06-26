class GamesController < ApplicationController

  def create

  end

  private

  def games_params
    params.require(:games).permit()
  end
end