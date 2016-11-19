Rails.application.routes.draw do
  root 'home#index'
  resources :games, only: [:index, :create, :update, :destroy]


end
