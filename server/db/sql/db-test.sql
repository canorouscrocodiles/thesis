DROP DATABASE IF EXISTS thesis_test;
CREATE DATABASE thesis_test;

\c thesis_test;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  username VARCHAR (50) NOT NULL UNIQUE,
  email VARCHAR (50) NOT NULL,
  img_url VARCHAR (100),
  bio VARCHAR (100)
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  updated_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  message VARCHAR (300) NOT NULL,
  coordinates VARCHAR (100) NOT NULL,
  location VARCHAR (100) NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  message VARCHAR (300) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions ON DELETE CASCADE,
  vote_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  answer_id INTEGER NOT NULL REFERENCES answers ON DELETE CASCADE,
  vote_type INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(24) NOT NULL,
  question_id INTEGER NOT NULL REFERENCES questions ON DELETE CASCADE
);

INSERT INTO users (username, email, img_url, bio)
  VALUES ('JohnSmith', 'js@example.com',
          'www.example.com/avatar.png', 'My first profile'
          );

INSERT INTO questions (user_id, message, coordinates, location)
  VALUES (1, 'Is Chipotle still open?',
          '{lat: 82.61723989, lng: -122.9553215}',
          '123 St. Johns Drive, San Francisco, Ca 90000'
          );

INSERT INTO answers (user_id, question_id, message)
  VALUES (1, 1, 'Yes, they always are open');

INSERT INTO votes (user_id, answer_id, vote_type)
  VALUES (1, 1, 1);

INSERT INTO categories (name, question_id)
  VALUES ('chipotle', 1);
