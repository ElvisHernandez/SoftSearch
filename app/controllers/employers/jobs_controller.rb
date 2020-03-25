# frozen_string_literal: true

class Employers::JobsController < Employers::AdminBaseController
  before_action :is_current_user
  skip_before_action :verify_authenticity_token

  def index
    @user_id = params['admin_id']
    @jobs = Job.where(user_id: @user_id)
  end

  def show
    @job = Job.find(params[:id])
  end

  def new
    @user_id = params['admin_id']
    @job = Job.new
    @skills = Skill.all
  end

  def create

    puts "??????????????????????????????????????????????????????????????????????????????????????????????///////////#{params}"
    job = Job.new(job_params.except(:skills))
    job.user = current_user
    job.save
    job_params[:skills].each do |skill_id|
      job.job_skills.create(job: job, skill: Skill.find(skill_id)) if skill_id.length > 0
    end
    redirect_to employers_admin_jobs_path
  end

  def destroy
    @job = Job.find(params[:id])
    @job.destroy

    redirect_to employers_admin_jobs_path
  end

  def apps
    @user_id = params['admin_id']
    @jobs = Job.where(user_id: @user_id)
  end

  def handle_app
    response = params['response'].to_i
    job_app_id = params['job_app_id'].to_i
    JobApp.find(job_app_id).update_attribute(:status,response)

    redirect_to employers_admin_apps_path
  end

  def add_skill
    skill_to_add = params['skill']
    Skill.create(name: skill_to_add)
    render json: { skills: Skill.all }
  end

  private

  def job_params
     params.require(:job).permit(:company_name, :description, :position, :longitude, :latitude, :user_id, :skills => [])
  end

  def is_current_user
    user_url_id = params['admin_id'].to_i
    unless current_user.id == user_url_id
        redirect_to root_path
    end
  end
end
