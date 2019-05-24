DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS metrics;
DROP TABLE IF EXISTS meals;

CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  username VARCHAR(255),
  password VARCHAR(255),
  FOREIGN KEY
);

CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  starting_weight VARCHAR(255),
  height VARCHAR(255),
  age VARCHAR(255),
  sex VARCHAR(255),
  activity_level VARCHAR(255),
  goal_weight INTEGER NOT NULL,
  FOREIGN KEY
);

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  daily_caloric_goal VARCHAR(255),
  meal_title VARCHAR(255),
  ready_in VARCHAR(255),
  serving_size VARCHAR(255),
  meal_image VARCHAR(255),
  nutrients VARCHAR(255),
  FOREIGN KEY
);