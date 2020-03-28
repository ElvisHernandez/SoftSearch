class PagesController < ApplicationController
    #before_action :authenticate_user!
    #before_action :ensure_applicant_user!
    skip_before_action :verify_authenticity_token


    def home 
        @skills = Skill.all
    end

    def show
        render template: "pages/#{params[:page]}"
    end

    def search
        puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!///////////#{params}"
        query = params['q']            
        redirect_to controller: :maps, action: :show, location: query, :format => 'html'
    end

end
