Rails.application.routes.draw do
  resources :games
  root 'home#index'
end
