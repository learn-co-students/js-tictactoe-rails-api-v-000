class GamesController < ActionController::Base
  protect_from_forgery with: :exception

  def create
    game = Game.create(params.require(:game).permit(state: []))
    render json: {game: game.as_json(only: [:id,:state])}
  end
  
  def update
    game = Game.find(params[:id])
    game.update(params.require(:game).permit(state: []))
    render json: {game: game.as_json(only: [:id,:state])}
  end

  def index
    render json: {games: Game.all.as_json(only: [:id,:state])}
  end

  private
  
  def game_params
    params.require(:game).permit(:id, state: [])
  end
  
end