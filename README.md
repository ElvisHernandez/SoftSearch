# Soft Search

## About the App

Soft Search is a career search web application specifically created for Software Development.


The appication allows for two types of users, employers and employees/applicants. Employers have the ability to post jobs that will be rendered on a mapboxgl instance object. Employers can then accept or deny applicants as they see fit. When an employer creates a job, they have the option to assign skills from a pre-existing list or they can generate their own if they so wish. 

Applicants on the other hand can search for jobs by a specific location search query which will bring up all jobs within a 100 mile radius of that query. Optionally, they can also view all available jobs at once. Jobs are displayed graphically on the map by way of geoJSON layers that represent all the jobs that require a certain skill. These layers allow 
users to further edit their job search by filtering in/out skills that they do or dont want.

The idea here was to simplify the job search so that applicants do not 
have to worry about targeting roles with similar skill sets but very different titles. This way location and skills are all that a applicant has to consider.

Applicants also have the ability to apply for jobs directly on the listings page or they can favorite them and apply to them at a later time.

Several APIs were built for the front end to communicate with the backend. Only on is publically available as the others involve specific user data.

Our pulic API allows anyone to retrive job listings by location, or optionally retrieve all jobs.

To retrieve all jobs posted in JSON format, make a GET request to this endpoint: https://s0ft-search.herokuapp.com/map/jobs.json?location=GET_ALL

To narrow the search by location just enter your desired location in place of GET_ALL for the location query parameter. For example,
https://s0ft-search.herokuapp.com/map/jobs.json?location=miami


## CONTRIBUTORS
- Elvis Hernandez
- Iman Bashir
- Leigh Chin
- Maria Beckles


# Technologies used
- Ruby and Ruby on Rails →  2.6.0 or higher and Rails 6
- Bootstrap 
- React with react-rails gem
- postgreSQL as the database
- Mapbox Gl JS API

# API requirements to use app 
1. The API Website: https://bit.ly/MapBoxGL
2. Sign up with your email.
3. Get your API Key. https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
4. Create environment variable:  MAPBOX_KEY=API_KEY
5. Place your environment variable in .env file.

# Setup To Start
1. rails db:create
2. rails db:migrate
3. bundle
4. yarn
5. rails s
6. Open http://localhost:3000 to view in the browser.

# Deployment
1. heroku create
2. git push heroku master
3. heroku run rake db:migrate
4. Heroku open


