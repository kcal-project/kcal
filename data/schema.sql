DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS metrics;
DROP TABLE IF EXISTS meals;
DROP TABLE IF EXISTS recipes;


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

-- CREATE TABLE meals (
--   id SERIAL PRIMARY KEY,
--   daily_caloric_goal VARCHAR(255),
--   meal_title VARCHAR(255),
--   ready_in VARCHAR(255),
--   serving_size VARCHAR(255),
--   meal_image VARCHAR(255),
--   nutrients VARCHAR(255),
--   FOREIGN KEY (user_id) REFERENCES users (id)
-- );

-- CREATE TABLE recipes (
--   id SERIAL PRIMARY KEY,
--   daily_caloric_goal VARCHAR(255),
--   meal_title VARCHAR(255),
--   ready_in VARCHAR(255),
--   serving_size VARCHAR(255),
--   meal_image VARCHAR(255),
--   nutrients VARCHAR(255),
--   FOREIGN KEY (meal_id) REFERENCES meals (id)
-- );