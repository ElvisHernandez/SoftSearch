require 'rails_helper'
require 'data'

RSpec.describe Job, type: :model do
  include MetaData
  
  subject {
    described_class.new(
      company_name: 'SoftSearch',
      position: "sr. dev",
      description: "Loremh",
      longitude: -80.2,
      latitude:45.1,
      user_id: User.create(email:"blah@yahoo.com",password:"123456", employer:true).id 
                      )
  }

  describe "Validations" do
    
    it "is valid with valid attributes" do 
      expect(subject).to be_valid
    end

    it "is not valid without a position" do
      should validate_presence_of(:position)
    end

    it "is not valid without a description" do
      should validate_presence_of(:description)
    end

    it "is not valid without a longitude" do
      should validate_presence_of(:longitude)
    end

    it "is not valid without a latitude" do
      should validate_presence_of(:latitude)
    end

    it "is not valid without a user_id" do
      should validate_presence_of(:user_id)
    end

    it "is not valid with a user_id that belongs to a user where employer:false" do
      employee_user = MetaData::employee
      employee_jobs = MetaData::jobs(employee_user.id)
      expect(employee_jobs.length).to eq 0
    end
  end


  describe "User Associations" do
    
    it "should belong to a unique user where { employer: true }" do
      should belong_to(:user).
      with_foreign_key('user_id').
      conditions(employer:true) 
    end

    it "should be able to access its poster" do
      expect(subject.user.email).to eq "blah@yahoo.com"
    end
  end

  describe "JobApp Associations" do

    it "should be able to access its job_apps" do 
      employer_job = MetaData::user_meta_data[2][0]
      expect(employer_job.job_apps.length).to eq 1
    end

    it "should be able to access the user associated with the JobApp" do
      employer_job = MetaData::user_meta_data[2][0]
      expect(employer_job.job_apps[0].user.email).to eq "employee@gmail.com"
    end

    it "destroy its corresponding job_apps when destroyed" do
      job_apps = MetaData::user_meta_data(2)[0]
      expect(job_apps.length).to eq 0
    end

    it "should have many job_apps and destroy all associated job_apps when destroyed"  do
      should have_many(:job_apps).dependent(:destroy) 
     end
  end

  describe "UserFavorite Associations" do

    it "should be able to access its user_favorites" do 
      employer_job = MetaData::user_meta_data[2][0]
      expect(employer_job.user_favorites.length).to eq 1
    end

    it "should be able to access the user associated with the UserFavorite" do
      employer_job = MetaData::user_meta_data[2][0]
      expect(employer_job.user_favorites[0].user.email).to eq "employee@gmail.com"
    end

    it "destroy its corresponding user_favorites when destroyed" do
      user_favs = MetaData::user_meta_data(2)[1]
      expect(user_favs.length).to eq 0
    end

    it "should have many user_favorites and destroy all associated 
        user_favorites when destroyed"  do
      should have_many(:user_favorites).dependent(:destroy) 
     end
  end

  describe "JobSkill Associations" do

    it "should have many job_skills and destroy all associated job_skills when destroyed"  do
      should have_many(:job_skills).dependent(:destroy) 
     end
  end
end
