DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "firstname" VARCHAR(255),
  "lastname" VARCHAR(50),
  username VARCHAR(50) UNIQUE
);