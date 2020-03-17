Rails.application.routes.draw do
  devise_for :users
  root "pages#home"

  resource :map, only: [:show]


  post '/search' => "pages#search"

  authenticated :user, ->(u) {!u.employer} do
    namespace :applicants do
      resources :users, only: [:index]
      # resource :user_job_applications, only: [:new]
      root to: "users#index"
    end
  end

  authenticated :user, ->(u) { u.employer } do
    namespace :employers do
      resources :admins, only: [:index]
      root to: "admins#index"
      # resource :admin_job_applications, only: [:new, :create]
      
    # root "pages#home"
    end
  end
  
  get '/signin/path' => 'pages#trigger_signin', as: 'signin'
  get '/signup/path' => 'pages#trigger_signup', as: 'signup'

end


