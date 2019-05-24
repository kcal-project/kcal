'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent'); // Not Need?  Still researching
const unirest = require('unirest');// https request client library like superagent  -- neede for rapid api
const pg = require('pg');
const ejs = require('ejs');

const app = express();

const PORT = process.env.PORT;

const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.log(err));

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');


// Routes

// app.get('/', getMealsFromDB);  
app.get('/', formIntake);  

app.post('/meals', searchNewMeals);  


app.get('*', (request, response) => response.status(404).send('This route does not exist'));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));



function formIntake (request, response){
  response.render('views/intake-form');
}



function searchNewMeals(request, response){
  response.send('Ok');
  unirest.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate?targetCalories=2000&timeFrame=day')
    .header('X-RapidAPI-Host', 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com')
    .header('X-RapidAPI-Key', `${process.env.X_RAPID_API_KEY}`)
    // .end(function (result) {
    //   
    // });
    .then(apiResponse => apiResponse.body.items.map(mealResult => new Meal(mealResult)))
    .then(results => {
      console.log(console.log('line$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', result.body);  //result.status, result.headers,);
      response.render('', {meals: results})
    })

    .catch(err => handleError(err,response));

}



// function Meal(newMeal) {
//   const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
//   this.title = info.volumeInfo.title ? info.volumeInfo.title : 'No title available';
//   this.readyInMinutes = info.volumeInfo.authors ? info.volumeInfo.authors : 'No author available';
//   this.servings = info.volumeInfo.description ? info.volumeInfo.description : 'No description available';
//   this.image = info.volumeInfo.imageLinks ? info.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : placeholderImage;
//   this.calories =
//   this.protein =
//   this.fat =
//   this.carbohydrates =
// }




function handleError(error, response){
  console.log(error);
  console.log('response', response);
  if (response) response.render('pages/error', {error: 'Something went wrong....  Try again!'});
}