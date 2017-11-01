Rails.application.routes.draw do
 
  root 'home#index'
  resources :games, only: [:index, :show, :create, :update]
  get '/reset', to: 'games#reset'
  patch '/games', to: 'games#update'
end
