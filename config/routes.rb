Rails.application.routes.draw do
  root 'home#index'
  resources :games, only: %i[index create update]
end
