Rails.application.routes.draw do

  root 'home#index'
  
  get '/games/', to: 'games#index'
  post '/games', to: 'games#create'
  get '/games/:id', to: 'games#game'
  patch '/games/:id', to: 'games#update'

end