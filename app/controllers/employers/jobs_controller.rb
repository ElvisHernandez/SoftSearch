# frozen_string_literal: true

class Employers::JobsController < Employers::AdminBaseController
  def index
    @jobs = Job.all
  end

  def show
    @job = Job.find(params[:id])
  end

  def new
    @job = Job.new
    @skills = Skill.all
  end

  def create
    job = Job.new(job_params.except(:skills))
    job.user = current_user
    job.save
    job_params[:skills].each do |skill_id|
      job.job_skills.create(job: job, skill: Skill.find(skill_id)) if skill_id.length > 0
    end
    redirect_to employers_jobs_path
  end

  private

  def job_params
     params.require(:job).permit(:company_name, :description, :position, :longitude, :latitude, :user_id, :skills => [])
  end
end
