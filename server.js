'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent'); // Not Need?  Still researching
const unirest = require('unirest');// https request client library like superagent  -- neede for rapid api
const pg = require('pg');
const ejs = require('ejs');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

// Routes

// app.get('/', getMealsFromDB);
// app.get('/', formIntake);
app.get('/about', aboutUs);

app.get('/', getLogIn);
app.get('/join', showForm);
app.post('/join', addUser);
app.post('/', allowIn);

app.post('/my-dashboard', saveMetricsToDB);
// app.post('/my-dashboard', saveMetricsToDB);

// app.post('/', createJoke);


// app.get('/', search);


//app.post('/my-dashboard', searchNewMeals);



app.get('*', (request, response) => response.status(404).send('This route does not exist'));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

//Login content! ////////////////////////////////////////////////////////////

function addUser(request, response) {
  // console.log('🤨', request.body);

  let {firstname, lastname, username } = request.body;

  firstname = firstname.toLowerCase();
  lastname = lastname.toLowerCase();
  username = username.toLowerCase();
  console.log('This is the user email: ', username);

  let userExist = 'SELECT * FROM users WHERE username = $1;';
  let values1 = [username];

  client.query(userExist, values1)
    .then(results => {
      if(results.rows.length > 0) {
        response.render('pages/join');
        console.log('this username exist!!!')
      } else {
        let SQL = 'INSERT INTO users (firstname, lastname, username) VALUES ($1, $2, $3);';
        let values = [firstname, lastname, username];

        client.query(SQL, values)
          .then(result => {
            console.log(result);
            response.redirect('/');
          })
          .catch(error => handleError(error, response));
      }
    })
    .catch(error => handleError(error, response));
}

function showForm(request, response) {
  response.render('pages/join')
}

function getLogIn(request, response) {
  response.render('pages/index')
}

function allowIn(request, response) {
  console.log(process.env.DATABASE_URL);
  let {username} = request.body;

  let checkForUser = 'SELECT * FROM users WHERE username = $1;';
  let value = [username];

  client.query(checkForUser, value)
    .then(results => {
      console.log(results);
      if(results.rowCount !== 0 && results.rows[0].username === username) {
        response.render('pages/intake-form');
        console.log('success 😀')
      } else {
        response.render('pages/join');
        console.log('this route failed 😭😢');
      }
    })
    .catch(error => handleError(error, response))
}

function handleError(error, response) {
  console.log(error);
  response.render('pages/error', { error: error });
}



function aboutUs(request, response) {
  response.render('pages/about');
}

function getBmr(request, response){
  let height = request.body.height;
  let weight = request.body.weight;
  let age =  request.body.age;
  let sex = request.body.sex;
  let activity = request.body.getActivity;
  let loss = request.body.loss;

  let bmrWithoutActivity = 0;
  if (sex === 'male'){
    bmrWithoutActivity = (10*(weight/2.205)+ 6.25*(height*2.54) - (5*age) + 5);
  }
  else{
    bmrWithoutActivity = (10*(weight/2.205) + (6.25*(height*2.54)) - (5*age) - 161);
  }
  let completeBmr = Math.floor(bmrWithoutActivity * activity);

  if (loss === 'mild'){
    return completeBmr -215;
  }
  if (loss === 'moderate'){
    return completeBmr -500;
  }
  if (loss === 'extreme'){
    return completeBmr -1000;
  }
}

function goalDate(request, response){
  let today = new Date();
  let loss = request.body.loss;
  let weight = request.body.weight;
  let goal =  request.body.goal;


  if (loss === 'mild'){
    let weeks = ((weight - goal)/.5);
    let days = weeks*7;
    today.setDate(today.getDate() + days);

    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var y = today.getFullYear();

    var formattedDate = mm + '/' + dd + '/' + y;
    return formattedDate;
  }
  if (loss === 'moderate'){
    let weeks = ((weight - goal)/1);
    let days = weeks*7;
    today.setDate(today.getDate() + days);

    dd = today.getDate();
    mm = today.getMonth() + 1;
    y = today.getFullYear();

    formattedDate = mm + '/' + dd + '/' + y;
    return formattedDate;
  }
  if (loss === 'extreme'){
    let weeks = ((weight - goal)/2);
    let days = weeks*7;
    today.setDate(today.getDate() + days);

    dd = today.getDate();
    mm = today.getMonth() + 1;
    y = today.getFullYear();

    formattedDate = mm + '/' + dd + '/' + y;
    return formattedDate;
  }
}

function formIntake(request, response) {
  response.render('pages/intake-form');
}

function searchRecipe(data){
  console.log('line 123 ######################################### data', data.idArray);
  // for (let i = 0; i <= apiResponse.body.meals.length; i++){

  return superagent.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1003464/ingredientWidget.json')
    .set('X-RapidAPI-Host', 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com')
    .set('X-RapidAPI-Key', `${process.env.X_RAPID_API_KEY}`)

    .then(apiResponse => {

      let ingredients = apiResponse.body.ingredients.map(recResult => new Recipe(recResult));

      // console.log('line 134 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',ingredients);
      return [ingredients, data];
    })

}

let searchNewMeals = function(request, response)  {
  console.log('🤨line 214 ****************************************', request.body);
  let calories = getBmr(request, response);
  let projDate = goalDate(request, response);
  let plan = request.body.loss;

  let userData = superagent.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate?targetCalories=${calories}&timeFrame=day`)
    .set('X-RapidAPI-Host', 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com')
    .set('X-RapidAPI-Key', `${process.env.X_RAPID_API_KEY}`)

    .then(apiResponse => {
      let data = {};
      data.meals = apiResponse.body.meals.map(mealResult => new Meal(mealResult));
      // console.log('meals$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', data.meals);
      data.nutrients = apiResponse.body.nutrients;
      data.idArray = data.meals.map((meal)=> meal.id);
      return data;
    })

    .then(result=> searchRecipe(result)
    )
    .then (result => {
      // console.log('line 161 result[0]', result[0]);
      console.log('line 162 $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$result[1]', result[1]);
      let userObj= result[1];
      userObj.ingredients= result[0];
      return userObj;
    })


    .then(result => {
      let {meals, nutrients, ingredients}= result;
      // console.log(meals, nutrients, ingredients);
      response.render('pages/my-dashboard', {meals: meals, nutrients: nutrients, projDate: projDate, plan: plan, ingredients: ingredients})
    })
    .catch(err => handleError(err));


}



function saveMetricsToDB(request, response) {

  

  console.log('request.body line 255 ********', request.body);
  let { age, height, sex, weight, getActivity, goal, loss} = request.body;

  let SQL = 'INSERT INTO metrics (age, height, sex, weight, getActivity, goal, loss) VALUES ($1, $2, $3, $4, $5, $6, $7);';
  let values = [age, height, sex, weight, getActivity, goal, loss];

  return client.query(SQL, values)

    .then(searchNewMeals(request, response))
    .catch(err => handleError(err, response))
    


}

// { age: '56',
//   height: '72',
//   sex: 'male',
//   weight: '222',
//   getActivity: '1.2',
//   goal: '180',
//   loss: 'mild' }



function Recipe(newRec){

  this.name = newRec.name;
  this.value = newRec.amount.us.value;
  this.unit = newRec.amount.us.unit;
}


function Meal(newMeal) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.id = newMeal.id ? newMeal.id : 'No id available';
  this.title = newMeal.title ? newMeal.title : 'No title available';
  this.readyInMinutes = newMeal.readyInMinutes ? newMeal.readyInMinutes : 'No info available';
  this.servings = newMeal.servings ? newMeal.servings : 'No info available';
  this.image = `https://spoonacular.com/recipeImages/${newMeal.image}` ? `https://spoonacular.com/recipeImages/${newMeal.image}` : placeholderImage;
}


function handleError(error, response) {
  console.log(error);
  console.log('response', response);
  if (response) response.render('pages/error', { error: 'Something went wrong....  Try again!' });
}


// random food jokes
function createJoke(request, response) {
  superagent.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/jokes/random')
    .set('X-RapidAPI-Host', 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com')
    .set('X-RapidAPI-Key', `${process.env.X_RAPID_API_KEY}`)
    .then(apiResponse => {
      console.log('apiResponse', apiResponse.body.text);
      let joke = apiResponse.body.text
      response.render('/index', {joke})
    })
}




