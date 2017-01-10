class HomeController < ApplicationController

  def index
    @states = Game.all
    respond_to do |format|
      format.html {render :index}
      format.json {render json: @states}
    end 
  end

  def show
    @state = Game.find(params[:id])
    render json: @state
  end

  def save
    @state = Game.create(save_params)
    render json: @state, status: 201
  end

  private

  def save_params
    params.require(:game).permit({state: []})
  end

end
