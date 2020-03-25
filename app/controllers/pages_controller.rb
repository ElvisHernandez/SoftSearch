class PagesController < ApplicationController
    #before_action :authenticate_user!
    #before_action :ensure_applicant_user!

    def home 
        @skills = Skill.all
    end

    def show
        render template: "pages/#{params[:page]}"
    end

    def search
        query = params['q']            
        redirect_to controller: :maps, action: :show, location: query
    end

    def trigger_signin
    end

    def trigger_signup
    end

    
    def ensure_applicant_user!
        unless current_user and current_user.employer == false
            redirect_to root_path
        end
    end
end
