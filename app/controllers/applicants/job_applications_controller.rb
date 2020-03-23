class Applicants::JobApplicationsController < Applicants::UserBaseController
    before_action :is_current_user
   
    def index
    end

    def new
        @job_app = JobApp.new
        puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//////////////#{params}"
    end

    def create 
    end

    private

    def is_current_user
        user_url_id = params['user_id'].to_i
        unless current_user.id == user_url_id
            redirect_to root_path
        end
    end
end
