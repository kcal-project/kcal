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




function getBmr(request, response){
  let height = request.body.height;
  let weight = request.body.weight;
  let age =  request.body.age;
  let sex = request.body.sex;
  let activity = request.body.getActivity;
  let goal =  request.body.goal;
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

function formIntake(request, response) {
  response.render('pages/intake-form');
}



function searchNewMeals(request, response){
  let calories = getBmr(request, response);

  superagent.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate?targetCalories=${calories}&timeFrame=day`) // summary
    .set('X-RapidAPI-Host', 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com')
    .set('X-RapidAPI-Key', `${process.env.X_RAPID_API_KEY}`)

    .then(apiResponse => {

      // console.log('line 47 apirespones',apiResponse);
      let meals = apiResponse.body.meals.map(mealResult => new Meal(mealResult));
      // console.log(meals);
      let nutrients = apiResponse.body.nutrients;//(nutrientsResult => new Nutrients(nutrientsResult));

      // console.log(nutrients);
      response.render('pages/results', {meals: meals, nutrients: nutrients})
    })

    .catch(err => handleError(err,response));

}

// function searchRecipe(request, response, apiResponse){

//   for (let i = 0; i <= apiResponse.body.meals.length; i++){

//     superagent.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${apiResponse.body.meals[i].id}/summary`)
//       .set('X-RapidAPI-Host', 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com')
//       .set('X-RapidAPI-Key', `${process.env.X_RAPID_API_KEY}`)

//       .then(response => {
//         let recipe = response.body.meals.map(recResult => new Recipe(recResult));

//         console.log(recipe);
//         response.render('pages/results', {recipe: recipe});
//       })
//   }
// }



function Recipe(newRec){
  this.id = newRec.id;
  this.title = newRec.title;
  this.summary = newRec.summary;
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
