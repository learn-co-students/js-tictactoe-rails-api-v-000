Rails.application.routes.draw do
    root 'home#index'
    resources :games, only: [:index, :new, :update, :create]
end
