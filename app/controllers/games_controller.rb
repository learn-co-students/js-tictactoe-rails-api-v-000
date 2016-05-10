class GamesController < ApplicationController
  require 'json'

  def index
# byebug
    # @game=Game.new(state: Array.new(9, ""))
     
  end


  def create
# byebug
    @game=Game.create(state: params["game"])
    respond_to do |format|
      format.html { render 'home/index'}
      format.json { render json: @game }
    end
    # @game=Game.new
    # if @game.save!
    #   redirect_to games_path
    # else
    #   redirect_to games_path, :alert => "Your game did not save"
    # end
  end


  def update
byebug
    @game = Game.find_by(id: params[:id])
    @game.update(state: params["game"])
    respond_to do |format|
      format.html { render 'home/index'}
      format.json { render json: @game}
    end

    # if game.nil?
    #   @game = Game.create!(game_params)
    #   redirect_to games_path
    # else
    #   @game=game.update(game_params)
    #   redirect_to games_path
    # end
  end

end
