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
app.post('/views', searchNewMeals);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

function formIntake(request, response) {
  response.render('pages/intake-form');
}

function searchNewMeals(request, response){
  console.log(request.body);
  // response.send('Ok');
  superagent.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate?targetCalories=2000&timeFrame=day') // summary
    .set('X-RapidAPI-Host', 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com')
    .set('X-RapidAPI-Key', `${process.env.X_RAPID_API_KEY}`)

    .then(apiResponse => apiResponse.body.meals.map(mealResult => new Meal(mealResult)))  //console.log(apiResponse.body.meals))
    .then(results => {
   
      response.render('pages/results', {meals: results})
    })

    .catch(err => handleError(err,response));

}

function Meal(newMeal) {
  // const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.id = newMeal.id ? newMeal.id : 'No id available';
  this.title = newMeal.title ? newMeal.title : 'No title available';
  this.readyInMinutes = newMeal.readyInMinutes ? newMeal.readyInMinutes : 'No info available';
  this.servings = newMeal.servings ? newMeal.servings : 'No info available';
  this.image = newMeal.image; //? info.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : placeholderImage;
  // this.calories = newMeal.nutrients.calories;
  // this.protein = newMeal.nutrients.protein;
  // this.fat = newMeal.nutrients.fat;
  // this.carbohydrates = newMeal.nutrients.carbohydrates;
}

function handleError(error, response) {
  console.log(error);
  console.log('response', response);
  if (response) response.render('pages/error', { error: 'Something went wrong....  Try again!' });
}
