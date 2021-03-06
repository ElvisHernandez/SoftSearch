# frozen_string_literal: true

class Employers::JobsController < Employers::AdminBaseController
  before_action :is_current_user
  skip_before_action :verify_authenticity_token

  def index
    @user_id = params['admin_id']
    @jobs = Job.where(user_id: @user_id)
  end

  def new
    @user_id = params['admin_id']
    @job = Job.new
    @skills = Skill.all
  end

  def create
    if(!%i[company_name position description address admin_id skills].all? { |s| job_params.has_key? s })
      return
    end

    job_address = job_params['address']
    job_position = job_params['position']
    job_description = job_params['description']
    company_name = job_params['company_name']
    user_id = job_params['admin_id']

    
    coords = Geocoder.search(job_address)
    if coords.first
      coords = coords.first.coordinates.reverse
      job = Job.new(
        company_name: company_name,
        position: job_position,
        description: job_description,
        longitude: coords[0],
        latitude: coords[1],
        user_id: user_id
        )

      job.user = current_user
      job.save
      job_params[:skills].each do |skill_id|
        job.job_skills.create(job: job, skill: Skill.find(skill_id)) if skill_id.length > 0
      end
      redirect_to employers_admin_jobs_path
    else
      return
    end
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
     params.permit(:company_name, :description, :position, :address, :admin_id, :skills => [])
  end

  def is_current_user
    user_url_id = params['admin_id'].to_i
    unless current_user.id == user_url_id
        redirect_to root_path
    end
  end
end
