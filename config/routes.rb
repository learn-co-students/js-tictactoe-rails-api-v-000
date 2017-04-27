Rails.application.routes.draw do
  root 'home#index'
  get '/demo', to: 'games#demo'
  resources :games
end
