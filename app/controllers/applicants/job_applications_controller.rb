class Applicants::JobApplicationsController < Applicants::UserBaseController
    before_action :is_current_user
   
    def index
    end

    def new
        @job_app = JobApp.new
        # @job_id = params['job_id']
        # puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//////////////#{params}"

    end

    def create 
        puts "????????????????????????????????????????????????????????????????????????????????????//////////////#{params.inspect}"
        @job_app = JobApp.new(job_app_params)

        @job_app.save
        redirect_to applicants_user_job_applications_path
    end

    private

    def job_app_params
        params.require(:job_app).permit(:user_id, :job_id)
    end

    def is_current_user
        user_url_id = params['user_id'].to_i
        unless current_user.id == user_url_id
            redirect_to root_path
        end
    end
end
