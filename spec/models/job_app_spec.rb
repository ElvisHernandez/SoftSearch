require 'rails_helper'
require 'data'

RSpec.describe JobApp, type: :model do
  include MetaData
  
  subject {
    described_class.new(
      user_id: User.create(email:"blahblah@yahoo.com",password:"123456", employer:false).id,
      job_id: Job.create(
        company_name: 'SoftSearch',
        position: "sr. dev",
        description: "Loremh",
        longitude: -80.2,
        latitude:45.1,
        user_id: User.create(email:"blah@yahoo.com",password:"123456", employer:true).id
                        ).id
                        )
  }  

  describe "Validations" do
    
    it "is valid with valid attributes" do 
      expect(subject).to be_valid
    end

    it "is not valid without a user_id" do
      should validate_presence_of(:user_id)
    end


    it "is not valid without a job_id" do
      should validate_presence_of(:job_id)
    end

    it "should have status that defaults to 0" do
      expect(subject.status).to eq 0
    end

    it "should only allow integer statuses in the set [-1,0,1]" do
      should validate_numericality_of(:status)
      .only_integer
      .is_greater_than_or_equal_to(-1)
      .is_less_than_or_equal_to(1)
    end

    it "should not have multiple identical user_ids and job_ids" do 
      should validate_uniqueness_of(:user_id).scoped_to(:job_id)
    end

    it "is not valid with a user_id that belongs to a user where employer:true" do
      employer_user = MetaData::employer
      employer_jobs = MetaData::jobs(employer_user.id)
      employer_apps = MetaData::job_apps(employer_user.id,employer_jobs)
      expect(employer_apps.length).to eq 0
    end
  end

  describe "User Associations" do
    
    it "should belong to a unique user where { employer: false }" do
      should belong_to(:user).
      with_foreign_key('user_id').
      conditions(employer:false) 
    end

    it "should be able to access the user associated with it" do
      expect(subject.user.email).to eq "blahblah@yahoo.com"
    end
  end

  describe "Job Associations" do
    
    it "should belong to a unique job" do
      should belong_to(:job).
      with_foreign_key('job_id')
    end

    it "should be able to access the job associated with it" do
      expect(subject.job.position).to eq "sr. dev"
    end
  end
end
