# frozen_string_literal: true

Rails.application.routes.draw do
  get 'jobs/index'
  get 'home/index'
  devise_for :users
  root 'pages#home'
  get "/pages/:page" => "pages#show"

  resource :map, only: [:show]
  

  get 'map/jobs' => 'maps#jobs'
  post 'map/filter' => 'maps#filter'
  post 'map/unfilter' => 'maps#unfilter'
  post '/search' => 'pages#search'

  authenticated :user, ->(u) { !u.employer } do
    namespace :applicants do
      resources :users, only: [:index] do
        resources :job_applications
        get '/:job_id/job_applications/new', to: 'job_applications#new'
      end
      root to: 'users#index'
    end
  end

  authenticated :user, ->(u) { u.employer } do
    namespace :employers do
      resources :admins, only: [:index]
      root to: 'admins#index'
      resources :jobs, only: [:index, :show, :new, :create]

      # root "pages#home"
    end
  end

  get '/signin/path' => 'pages#trigger_signin', as: 'signin'
  get '/signup/path' => 'pages#trigger_signup', as: 'signup'
end
