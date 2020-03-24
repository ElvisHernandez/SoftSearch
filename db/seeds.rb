# # frozen_string_literal: true
# User.create_or_find_by!(email: 'Elvis@gmail.com', password: '123456', employer: true)
# User.create_or_find_by!(email: 'Iman@gmail.com', password: '0123456', employer: true)
# User.create_or_find_by!(email: 'Chris@gmail.com', password: '12345sdfs6', employer: false)
# User.create_or_find_by!(email: 'Leigh@gmail.com', password: '1234567', employer: true)
# User.create_or_find_by!(email: 'Carolina@gmail.com', password: '12345sdfsd6', employer: false)
# User.create_or_find_by!(email: 'Maria@gmail.com', password: '12345678', employer: true)
# User.create_or_find_by!(email: 'Trystan@gmail.com', password: '12sdfs3456', employer: false)
# User.create_or_find_by!(email: 'Shawn@gmail.com', password: '12345sdfs6', employer: false)

# 1000.times do
#   employers = User.where(employer: true)
#   Job.create_or_find_by(
#     company_name: Faker::Company.name,
#     position: Faker::Job.title,
#     description: Faker::Lorem.paragraph,
#     longitude: Faker::Address.longitude,
#     latitude: Faker::Address.latitude,
#     user_id: employers[rand(1...employers.length)].id
#   )
# end 

# 500.times do
#   sleep 1
#   employers = User.where(employer: true)
#   location = Geocoder.search(Faker::Address.street_address)

#   if location.first
#     location = location.first.coordinates.reverse

#     Job.create_or_find_by(
#       company_name: Faker::Company.name,
#       position: Faker::Job.title,
#       description: Faker::Lorem.paragraph,
#       longitude: location[0],
#       latitude: location[1],
#       user_id: employers[rand(1...employers.length)].id
#   )
#   end
# end 


# programming_skills = ['Ruby', 'Python', 'C++', 'Java', 'React', 'C55',
#                       'Magento', 'SQL', 'C#', 'Swift', 'Objective C', 'Javascript', 'CSS', 'HTML']

# programming_skills.each do |skill|
#   Skill.create_or_find_by!(name: skill)
# end

Job.all.each do |job|
  skills = Skill.all
  JobSkill.create_or_find_by!(job_id: job.id, skill_id: skills[rand(0...skills.length)].id)
end
