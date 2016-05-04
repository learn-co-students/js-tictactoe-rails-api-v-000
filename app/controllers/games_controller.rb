class GamesController < ApplicationController

  def index
    @games = Game.all

    # render json: @games.map{|game| game.state.to_json}.to_json, status: 200
    render json: @games
  end

  def create
    gameState = params.first.first.split("")
    @game = Game.create(state: gameState)
    # render json: @game.state.to_json, status: 201 
    render json: @games
  end

  def update
    gameState = params.first.first.split("")
    @game = Game.update(state: gameState)
    # render json: @game.state.to_json, status: 201 
    render json: @games
    binding.pry
  end


end