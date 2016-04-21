Rails.application.routes.draw do

  root 'home#index'
  post '/games', to: 'games#create'
  patch '/games/:id', to: 'games#edit'
  get '/games/', to: 'games#index'
  get '/games/:id', to: 'games#show'

end
