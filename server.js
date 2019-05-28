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
app.get('/', formIntake);
app.get('/about', aboutUs);



app.post('/my-dashboard', searchNewMeals);


app.get('*', (request, response) => response.status(404).send('This route does not exist'));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

function aboutUs(request, response) {
  response.render('pages/about');
}

function getBmr(request, response){
  let height = request.body.height;
  let weight = request.body.weight;
  let age =  request.body.age;
  let sex = request.body.sex;
  let activity = request.body.getActivity;
  // let goal =  request.body.goal;
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

function searchNewMeals(request, response){
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

//app.post('/saved-menus/:user_id', saveMealPlanToDB);////////////////////////////

function saveMealPlanToDB(request, response) {

  let { id, title, readyInMinutes, servings, image, user_id} = request.body;

  let SQL = 'INSERT INTO meals(id, title, readyInMinutes, servings, image, user_id) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [id, title, readyInMinutes, servings, image, user_id];

  return client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}





function Recipe(newRec){

  this.id = newRec.id;
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

// superagent.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/jokes/random")
// .set("X-RapidAPI-Host", "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com")
// .set("X-RapidAPI-Key", "509ec1d697msh56b7f8c3810108cp1de311jsne54bddc4d03d")
