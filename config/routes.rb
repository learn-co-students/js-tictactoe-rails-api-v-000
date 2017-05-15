Rails.application.routes.draw do

  root 'home#index'

# GET "/games"
# POST "/games/:id"
# PATCH "/games/:id"
resources :games

  
end
