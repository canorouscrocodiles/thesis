DROP DATABASE IF EXISTS thesis_test;
CREATE DATABASE thesis_test;

\c thesis_test;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  username VARCHAR (50) NOT NULL UNIQUE,
  email VARCHAR (50) NOT NULL,
  img_url VARCHAR (200),
  bio VARCHAR (250)
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  updated_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  message VARCHAR (300) NOT NULL,
  coordinates VARCHAR (100) NOT NULL,
  location VARCHAR (100) NOT NULL,
  category_id INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
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
  name VARCHAR(24) NOT NULL
);

INSERT INTO users (username, email, img_url, bio)
  VALUES  ('JohnSmith', 'js@example.com', 'www.example.com/avatar.png',
          'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could'),
          ('CraigRodrigues', 'craig@craigrodrigues.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('JongKim', 'Jong@Kim.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('KeithAlpichi', 'Keith@Alpichi.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('JohnDoe', 'js@example.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('JoeSchmoe', 'hack@reactor.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('HackReactor', 'Reactor@Hack.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('WaterBottle', 'Water@bottle.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('ColdBrew', 'Iluv@coffee.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          ('HydroFlask', 'hydro@flask.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se');

INSERT INTO questions (user_id, message, coordinates, location, category_id, active)
  VALUES
  (1, 'Is Chipotle still open?', '{lat: 37.783494, lng: -122.407433}', '139 5th St', 1, 'true'),
  (2, 'Can someone describe the "Tenderloin" in San Francisco?', '{lat: 37.784167 lng: -122.413696}', '364 Eddy St', 19, 'true'),
  (3, 'Has anyone seen my son?! He is wearing a blue hat and a red shirt!', '{lat: 37.769706, lng: -122.462644}', 'Golden Gate Park', 15, 'true'),
  (4, 'How old is Kalmanovitz Hall?', '{lat: 37.775571, lng: -122.450901}', 'Kalmanovitz Hall', 9, 'true'),
  (5, 'Do people really eat birds?', '{lat: 37.795055, lng: -122.465570}', 'Piper Loop', 7, 'true'),
  (6, 'Does Scotland have the internet?', '{lat: 37.754576, lng: -122.417306}', '739 Capp St', 11, 'true'),
  (7, 'What part of the zoo MUST I see today?', '{lat: 37.732753, lng: -122.500183}', '1 Zoo Rd', 4, 'true'),
  (8, 'How do I get out of here?', '{lat: 37.826504, lng: -122.422676}', 'Alcatraz Island', 15, 'true'),
  (9, 'Did anyone just hear that explosion?!? OMG!', '{lat: 37.795103, lng: -122.402763}', 'Transamerica Pyramid', 15, 'true'),
  (10, 'Does anyone know why the traffic is at a standstill?!', '{lat: 37.798037, lng: -122.378160}', 'San Francisco - Oakland Bay Bridge', 6, 'true'),
  (1, 'Why is there so much traffic??', '{lat: 37.799961, lng: -122.376003}', 'San Francisco - Oakland Bay Bridge', 6, 'true'),
  (2, 'What floor is the Hack Reactor algorithms meetup on?', '{lat: 37.783856, lng: -122.408794}','944 Market St', 11, 'true'),
  (3, 'What is the best coffee shop around these parts?', '{lat: 37.783856, lng: -122.408794}', 'Powell St Station', 14, 'true'),
  (4, 'Chipotle still got dat guac?', '{lat: 37.782448, lng: -122.409532}', '989 Market St', 1, 'true'),
  (5, 'Does anyone have fingernail clippers? I’m turning into a neanderthal over here!', '{lat: 37.784590, lng: -122.409115}', '55 Cyril Magnin St', 8, 'true'),
  (6, 'What movie theater is the best around here? I want to see that new Fast and Furious movie!', '{lat: 37.783352, lng: -122.407277}', '60 5th St', 16, 'true'),
  (7, 'How do you know youre you?', '{lat: 37.739945, lng: -122.420177}', 'Cortland Ave & Elsie St', 18, 'true'),
  (8, 'Did they film that movie "The Rock" here?', '{lat: 37.825988, lng: -122.421729}', 'Alcatraz Island', 16, 'true'),
  (9, 'I only have a couple hours here at the museum. What floors and exhibits must I see while I am here?', '{lat: 37.785656, lng: -122.401243}', '143 3rd St', 4, 'true'),
  (10, 'Where the heck do I park for MoMA?', '{lat: 37.785823, lng: -122.400728}', '151 3rd St', 5, 'true');

INSERT INTO answers (user_id, question_id, message)
  VALUES
  (2, 1, 'Yes, they always are open'),
  (1, 1, 'Are you sure about that?!'),
  (4, 1, 'There are like 3 chipotle''s around here, which one do you mean?'),
  (10, 2, 'It is a district'),
  (4, 4, 'It is 80 years old.'),
  (3, 4, 'Have you tried google?'),
  (3, 3, 'Nevermind I found him!!'),
  (7, 7, 'The penguins! You must see the penguins!'),
  (8, 10, 'Overturned tractor trailer. Hope you have milk and bread.'),
  (3, 14, 'It sure doessssss! Awww yeeeeee!'),
  (5, 16, 'The Metreon'),
  (1, 17, '42'),
  (6, 20, 'The parking garage is in the back'),
  (6, 19, 'Floors 7 and 6 are worth seeing, especially the Time Room.'),
  (4, 5, 'Have you not heard of CHICKEN before...');

INSERT INTO votes (user_id, answer_id, vote_type)
  VALUES (1, 1, 1);

INSERT INTO categories (name)
  VALUES
  ('chipotle'),
  ('convention'),
  ('sports'),
  ('education'),
  ('advice'),
  ('traffic'),
  ('animals'),
  ('health'),
  ('history'),
  ('tourism'),
  ('tech'),
  ('business'),
  ('news'),
  ('food'),
  ('emergency'),
  ('music'),
  ('movies'),
  ('TV'),
  ('life'),
  ('love'),
  ('politics');
