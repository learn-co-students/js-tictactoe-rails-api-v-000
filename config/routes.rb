Rails.application.routes.draw do

  root 'home#index'
  resources :games, only: [:index, :create, :show, :update]

end
