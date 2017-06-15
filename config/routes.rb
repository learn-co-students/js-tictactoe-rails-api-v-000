Rails.application.routes.draw do

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root 'home#index'

  resources :games, only: [:index, :create, :update]

  # post "/games/:id", to: "games#update"

end
