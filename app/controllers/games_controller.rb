class GamesController < ApplicationController

  def index
  end


  def create
    @game=Game.new
    if @game.save!
      redirect_to games_path
    else
      redirect_to games_path, :alert => "Your game did not save"
    end
  end


  def update
    game = Game.find_by(id: params[:id])
    if game.nil?
      @game = Game.create!(game_params)
      redirect_to games_path
    else
      byebug
      @game=game.update(game_params)
      redirect_to games_path
    end
  end

  private

    def game_params
      params.require(:game).permit(state:[])
    end

end
