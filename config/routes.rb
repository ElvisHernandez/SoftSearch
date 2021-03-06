# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  root 'pages#home'

  resource :map, only: [:show]
  
  get 'map/jobs' => 'maps#jobs'
  post '/search' => 'pages#search'

  authenticated :user, ->(u) { !u.employer } do
    namespace :applicants do
      get 'users/:user_id/all_favorites', to: 'users#get_all_favs'
      get 'users/:user_id/favorites', to: 'users#index'
      post '/users/:user_id/favorites', to: 'users#create'
      delete 'users/:user_id/favorites', to: 'users#destroy'
      resources :users, only: [:index] do
        resources :job_applications
        get '/:job_id/job_applications/new', to: 'job_applications#new'
      end
      root to: 'users#index'
    end
  end

  authenticated :user, ->(u) { u.employer } do
    namespace :employers do
      resources :admins, only: [:index] do
        resources :jobs
        get '/apps', to: 'jobs#apps'
        get '/handle_app', to: 'jobs#handle_app'
        post '/add_skill', to: 'jobs#add_skill'
      end
      root to: 'admins#index'
    end
  end
end
