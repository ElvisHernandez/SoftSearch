class Applicants::JobApplicationsController < Applicants::UserBaseController
    before_action :is_current_user
   
    def index
        @job_apps = JobApp.all
    end

    def new
        @job_app = JobApp.new
        @job_id = params['job_id']
    end

    def create 
        user_email = job_app_params['email']
        job_id = job_app_params['job_id']
        user_id = User.where(email: user_email)[0].id

        @job_app = JobApp.new(user_id: user_id, job_id: job_id)

        if @job_app.save
            redirect_to applicants_user_job_applications_path
        else
            render 'new'
        end
    end

    private

    def job_app_params
        params.require(:job_app).permit(:email, :job_id)
    end

    def is_current_user
        user_url_id = params['user_id'].to_i
        unless current_user.id == user_url_id
            redirect_to root_path
        end
    end
end
