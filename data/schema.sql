DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS metrics;
DROP TABLE IF EXISTS meals;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "firstname" VARCHAR(255),
  "lastname" VARCHAR(50),
  username VARCHAR(50)
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
);

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  calories VARCHAR(255),
  protein VARCHAR(255),
  fat VARCHAR(255),
  carbohydrates VARCHAR(255),
  image VARCHAR(800),
  title VARCHAR(255),
  readyInMinutes VARCHAR(255),
  name VARCHAR(255),
  value VARCHAR(255),
  unit VARCHAR(255)
);
