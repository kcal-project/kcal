# [KcalWorks.com](http://kcalworks.com/)

# kcal

Authors of Project: kcal

Adriana Graybill, Chance Harmon, Brad Smialek, Jeremy Lee

Project Descripton: 

kcal is a weight loss application that tailors specialized meals for the user, to assist the user in finding healthy meal choices, to support a healthy diet and achieve wieght loss. The applications will accomplish this by taking in metrics related to the user's body type and other inputs, such as targeted weight loss goals and estimated time of completion to achieve targeted weight loss results.Based on the metrics and inputs that are entered the application will provide the user with meal suggestions that are conducive to helping the end user loss weight.

Problem Domain:

User are constantly bombarded with lose weight quick schemes dietary plans, that ultimately doesn’t work. 
As a user, I need a way to tailor my dietary experience to find meals that maximizes my weight loss performance. 
As a user, I need a web application that will assist me with finding these healthy meal choices. 
As a user, I need and intuitive user experience with well-defined field sets when engaging with the application user interface. 
As user, I need a way to actively monitor my weight loss progress, to continuously make changes to my dietary experience, for maximum weight loss results. 

Problem Domain Resultions: 

As a developer, I want to provide the user a persoanlized experience.
As a developer, the user should be able to use real body metrics to formulate a meal plan to achieve thier weight loss goal.
As a developer, The user should be able to update their weight loss, and have a diet plan recalculate what the diet should be for user weight loss goals..

Version: 2.1 = The best product we could accomplish within the timeframe. For a small investment of $100,000,000 we could make this app know your diet before you know you need it. Go team Kcal!


Libraries Used:
  
    "cors": "^2.8.5",
    "dotenv": "^8.0.0",
    "ejs": "^2.6.1",
    "express": "^4.17.0",
    "method": "^2.0.0",
    "method-override": "^3.0.0",
    "nodemon": "^1.19.1",
    "override": "0.0.1",
    "pg": "^7.11.0",
    "superagent": "^5.0.5",
    "unirest": "^0.6.0"

  Current Libraries Used



User Reqs:
 1) type <a>kcalworks.com</a> into your browser
 2) If that is not compatible with the device you are using, try <a>https://kcalworks.herokuapp.com/</a>
3) If all else fails, set port to 3000, update psql to psql -f data/schema.sql -d kcal, and go sick with your diet!

End Points:
  // Routes
app.get('/', createJoke);
app.get('/about', aboutUs);
app.get('/', getLogIn);
app.get('/join', showForm);
app.post('/join', addUser);
app.post('/', allowIn);
app.post('/my-dashboard/:user_id', saveMetricsToDB);
app.put('/my-dashboard/:user_id', updateMetrics);
app.get('*', (req, res) => res.status(404).send('This route does not exist'));
app.post('/saved-menus/:user_id',saveMealPlanToDB);

Data Base Schema:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "firstname" VARCHAR(255),
  "lastname" VARCHAR(50),
  username VARCHAR(50) UNIQUE
);


CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  age VARCHAR(255),
  height VARCHAR(255),
  sex VARCHAR(255),
  weight VARCHAR(255),
  getActivity VARCHAR(255),
  goal VARCHAR(255),
  loss VARCHAR(255)
  -- FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  calories VARCHAR(255),
  protein VARCHAR(255),
  fat VARCHAR(255),
  carbohydrates VARCHAR(255),
  image VARCHAR(255),
  title VARCHAR(255),
  readyInMinutes VARCHAR(255),
  name VARCHAR(255),
  value VARCHAR(255),
  unit VARCHAR(255)
  -- FOREIGN KEY (user_id) REFERENCES users (id)
);






Wireframe: 

<img src="/images/new-data-services-746313-unsplash.jpg">


Conflict Plan

Disagreements – When we disagree, we will do the following:
-    Bring it up, and actually discuss pros and cons
-    Listen to one another, make sure to value different opinions
-    Vote on options and move on

Complaints –
-    If there is a complaint, bring it up with a solution already in mind

Communication –
-    We will commit to communicate before we do anything on slack or text so that no issues arise
-    We will be kind to one another and respect each other’s differences

Communication
We will communicate over slack and possibly over text if that works best, we will have set hours.
Every person has air time and we verbally check to make sure we all are onboard.
We are responsible adults and are respectful of another, we have experienced unsafe environments so we are committed to not let that happen again.

