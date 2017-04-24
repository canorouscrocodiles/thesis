DROP DATABASE IF EXISTS thesis_development;
CREATE DATABASE thesis_development;

\c thesis_development;

CREATE EXTENSION postgis;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  username VARCHAR (50) NOT NULL,
  email VARCHAR (50) NOT NULL,
  img_url VARCHAR (200),
  bio VARCHAR (250)
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  updated_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  last_viewed_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  message VARCHAR (300) NOT NULL,
  coordinates geography(POINT,4326) NOT NULL,
  location VARCHAR (100) NOT NULL,
  category_id INTEGER NOT NULL,
  vote_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  updated_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  message VARCHAR (300) NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions ON DELETE CASCADE,
  vote_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  created_timestamp TIMESTAMP DEFAULT now() NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users ON DELETE CASCADE,
  question_id INTEGER DEFAULT NULL REFERENCES questions ON DELETE CASCADE,
  answer_id INTEGER DEFAULT NULL REFERENCES answers ON DELETE CASCADE,
  vote_type INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(24) NOT NULL
);

CREATE TABLE IF NOT EXISTS sockets (
  id VARCHAR(40) PRIMARY KEY,
  user_id BIGINT DEFAULT NULL REFERENCES users ON DELETE CASCADE,
  coordinates geography(POINT,4326) NOT NULL
);

INSERT INTO users (id, username, email, img_url, bio)
  VALUES  (1, 'JohnSmith', 'js@example.com', 'www.example.com/avatar.png',
          'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could'),
          (2, 'CraigRodrigues', 'craig@craigrodrigues.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (3, 'JongKim', 'Jong@Kim.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (4, 'KeithAlpichi', 'Keith@Alpichi.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (5, 'JohnDoe', 'js@example.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (6, 'JoeSchmoe', 'hack@reactor.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (7, 'HackReactor', 'Reactor@Hack.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (8, 'WaterBottle', 'Water@bottle.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (9, 'ColdBrew', 'Iluv@coffee.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se'),
          (10, 'HydroFlask', 'hydro@flask.com', 'https://api.adorable.io/avatars/151/abott@adorable.png', 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could se');

INSERT INTO questions (user_id, message, coordinates, location, category_id, active)
  VALUES
  (1, '#1, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.407433, 37.783494), 4326), '139 5th St', 1, 'true'),
  (2, 'Can someone describe the "Tenderloin" in San Francisco?', ST_SetSRID(ST_MakePoint(-122.413696, 37.784167), 4326), '364 Eddy St', 19, 'true'),
  (3, 'Has anyone seen my son?! He is wearing a blue hat and a red shirt!', ST_SetSRID(ST_MakePoint(-122.462644, 37.769706), 4326), 'Golden Gate Park', 15, 'true'),
  (4, 'How old is Kalmanovitz Hall?', ST_SetSRID(ST_MakePoint(-122.450901, 37.775571), 4326), 'Kalmanovitz Hall', 9, 'true'),
  (5, 'Do people really eat birds?', ST_SetSRID(ST_MakePoint(-122.465570, 37.795055), 4326), 'Piper Loop', 7, 'true'),
  (6, 'Does Scotland have the internet?', ST_SetSRID(ST_MakePoint(-122.417306, 37.754576), 4326), '739 Capp St', 11, 'true'),
  (7, 'What part of the zoo MUST I see today?', ST_SetSRID(ST_MakePoint(-122.500183, 37.732753), 4326), '1 Zoo Rd', 4, 'true'),
  (8, 'How do I get out of here?', ST_SetSRID(ST_MakePoint(-122.422676, 37.826504), 4326), 'Alcatraz Island', 15, 'true'),
  (9, 'Did anyone just hear that explosion?!? OMG!', ST_SetSRID(ST_MakePoint(-122.402763, 37.795103), 4326), 'Transamerica Pyramid', 15, 'true'),
  (10, 'Does anyone know why the traffic is at a standstill?!', ST_SetSRID(ST_MakePoint(-122.378160, 37.798037), 4326), 'San Francisco - Oakland Bay Bridge', 6, 'true'),
  (1, 'Why is there so much traffic??', ST_SetSRID(ST_MakePoint(-122.376003, 37.799961), 4326), 'San Francisco - Oakland Bay Bridge', 6, 'true'),
  (2, '#1, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.408794, 37.783856), 4326), '944 Market St', 11, 'true'),
  (3, 'What is the best coffee shop around these parts?', ST_SetSRID(ST_MakePoint(-122.408794, 37.783856), 4326), 'Powell St Station', 14, 'true'),
  (4, '#1, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409532, 37.782448), 4326), '989 Market St', 1, 'true'),
  (5, 'Does anyone have fingernail clippers? I’m turning into a neanderthal over here!', ST_SetSRID(ST_MakePoint(-122.409115, 37.784590), 4326), '55 Cyril Magnin St', 8, 'true'),
  (6, '#1, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407217, 37.783352), 4326), '60 5th St', 16, 'true'),
  (7, 'How do you know youre you?', ST_SetSRID(ST_MakePoint(-122.420177, 37.739945), 4326), 'Cortland Ave & Elsie St', 18, 'true'),
  (8, 'Did they film that movie "The Rock" here?', ST_SetSRID(ST_MakePoint(-122.421729, 37.825988), 4326), 'Alcatraz Island', 16, 'true'),
  (9, 'I only have a couple hours here at the museum. What floors and exhibits must I see while I am here?', ST_SetSRID(ST_MakePoint(-122.401243, 37.785656), 4326), '143 3rd St', 4, 'true'),
  (10, 'Where the heck do I park for MoMA?', ST_SetSRID(ST_MakePoint(-122.400728, 37.785823), 4326), '151 3rd St', 5, 'true'),
  (6, '#2, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.406868, 37.785674), 4326), '60 5th St', 16, 'true'),
  (2, '#2, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410407, 37.783805), 4326), '944 Market St', 11, 'true'),
  (1, '#2, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.408512, 37.784603), 4326), '139 5th St', 1, 'true'),
  (4, '#2, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.407025, 37.783274), 4326), '989 Market St', 1, 'true'),
  (6, '#3, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.406783, 37.785207), 4326), '60 5th St', 16, 'true'),
  (2, '#3, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410427, 37.783293), 4326), '944 Market St', 11, 'true'),
  (1, '#3, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.407316, 37.783293), 4326), '139 5th St', 1, 'true'),
  (4, '#3, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410357, 37.783813), 4326), '989 Market St', 1, 'true'),
  (6, '#4, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.411381, 37.783813), 4326), '60 5th St', 16, 'true'),
  (2, '#4, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.408949, 37.785416), 4326), '944 Market St', 11, 'true'),
  (1, '#4, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.406503, 37.783013), 4326), '139 5th St', 1, 'true'),
  (4, '#4, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410402, 37.782959), 4326), '989 Market St', 1, 'true'),
  (6, '#5, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.410574, 37.782654), 4326), '60 5th St', 16, 'true'),
  (2, '#5, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410381, 37.786008), 4326), '944 Market St', 11, 'true'),
  (1, '#5, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.411393, 37.783995), 4326), '139 5th St', 1, 'true'),
  (4, '#5, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409348, 37.782372), 4326), '989 Market St', 1, 'true'),
  (6, '#6, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407751, 37.782348), 4326), '60 5th St', 16, 'true'),
  (2, '#6, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410960, 37.784132), 4326), '944 Market St', 11, 'true'),
  (1, '#6, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.411262, 37.783821), 4326), '139 5th St', 1, 'true'),
  (4, '#6, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409248, 37.782988), 4326), '989 Market St', 1, 'true'),
  (6, '#7, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.409701, 37.783535), 4326), '60 5th St', 16, 'true'),
  (2, '#7, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.408075, 37.782109), 4326), '944 Market St', 11, 'true'),
  (1, '#7, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.407889, 37.782646), 4326), '139 5th St', 1, 'true'),
  (4, '#7, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409798, 37.785315), 4326), '989 Market St', 1, 'true'),
  (6, '#8, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.408656, 37.783019), 4326), '60 5th St', 16, 'true'),
  (2, '#8, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.407901, 37.782539), 4326), '944 Market St', 11, 'true'),
  (1, '#8, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.408386, 37.785713), 4326), '139 5th St', 1, 'true'),
  (4, '#8, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.406661, 37.785596), 4326), '989 Market St', 1, 'true'),
  (6, '#9, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.406665, 37.785160), 4326), '60 5th St', 16, 'true'),
  (2, '#9, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.408792, 37.782932), 4326), '944 Market St', 11, 'true'),
  (1, '#9, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.409121, 37.781839), 4326), '139 5th St', 1, 'true'),
  (4, '#9, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410880, 37.783493), 4326), '989 Market St', 1, 'true'),
  (6, '#10, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407808, 37.782999), 4326), '60 5th St', 16, 'true'),
  (2, '#10, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.406908, 37.786040), 4326), '944 Market St', 11, 'true'),
  (1, '#10, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.407168, 37.785699), 4326), '139 5th St', 1, 'true'),
  (4, '#10, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.407678, 37.785361), 4326), '989 Market St', 1, 'true'),
  (6, '#2, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407969, 37.783156), 4326), '60 5th St', 16, 'true'),
  (2, '#2, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.408434, 37.782491), 4326), '944 Market St', 11, 'true'),
  (1, '#2, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.406850, 37.785161), 4326), '139 5th St', 1, 'true'),
  (4, '#2, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410585, 37.783349), 4326), '989 Market St', 1, 'true'),
  (6, '#3, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407619, 37.785320), 4326), '60 5th St', 16, 'true'),
  (2, '#3, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.411079, 37.782924), 4326), '944 Market St', 11, 'true'),
  (1, '#3, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.406434, 37.783866), 4326), '139 5th St', 1, 'true'),
  (4, '#3, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409345, 37.786092), 4326), '989 Market St', 1, 'true'),
  (6, '#4, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.409704, 37.785779), 4326), '60 5th St', 16, 'true'),
  (2, '#4, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.407344, 37.786007), 4326), '944 Market St', 11, 'true'),
  (1, '#4, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.410107, 37.784556), 4326), '139 5th St', 1, 'true'),
  (4, '#4, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.407938, 37.782100), 4326), '989 Market St', 1, 'true'),
  (6, '#5, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407774, 37.782681), 4326), '60 5th St', 16, 'true'),
  (2, '#5, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.409970, 37.785248), 4326), '944 Market St', 11, 'true'),
  (1, '#5, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.409349, 37.785557), 4326), '139 5th St', 1, 'true'),
  (4, '#5, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.406850, 37.783377), 4326), '989 Market St', 1, 'true'),
  (6, '#6, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.411054, 37.786120), 4326), '60 5th St', 16, 'true'),
  (2, '#6, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410450, 37.784646), 4326), '944 Market St', 11, 'true'),
  (1, '#6, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.406874, 37.782490), 4326), '139 5th St', 1, 'true'),
  (4, '#6, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409718, 37.785710), 4326), '989 Market St', 1, 'true'),
  (6, '#7, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407097, 37.783390), 4326), '60 5th St', 16, 'true'),
  (2, '#7, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.407737, 37.783036), 4326), '944 Market St', 11, 'true'),
  (1, '#7, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.407083, 37.782396), 4326), '139 5th St', 1, 'true'),
  (4, '#7, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410131, 37.784605), 4326), '989 Market St', 1, 'true'),
  (6, '#8, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.409570, 37.782877), 4326), '60 5th St', 16, 'true'),
  (2, '#8, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.408421, 37.785883), 4326), '944 Market St', 11, 'true'),
  (1, '#8, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.406580, 37.783812), 4326), '139 5th St', 1, 'true'),
  (4, '#8, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.408913, 37.784528), 4326), '989 Market St', 1, 'true'),
  (6, '#9, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407629, 37.782384), 4326), '60 5th St', 16, 'true'),
  (2, '#9, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.407323, 37.783888), 4326), '944 Market St', 11, 'true'),
  (1, '#9, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.406717, 37.784352), 4326), '139 5th St', 1, 'true'),
  (4, '#9, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409350, 37.785644), 4326), '989 Market St', 1, 'true'),
  (6, '#10, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407562, 37.782598), 4326), '60 5th St', 16, 'true'),
  (2, '#10, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.409546, 37.785013), 4326), '944 Market St', 11, 'true'),
  (1, '#10, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.410981, 37.783056), 4326), '139 5th St', 1, 'true'),
  (4, '#10, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.411359, 37.783066), 4326), '989 Market St', 1, 'true'),
  (6, '#2, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407374, 37.786003), 4326), '60 5th St', 16, 'true'),
  (2, '#2, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.409902, 37.785750), 4326), '944 Market St', 11, 'true'),
  (1, '#2, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.407942, 37.785552), 4326), '139 5th St', 1, 'true'),
  (4, '#2, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.408714, 37.782172), 4326), '989 Market St', 1, 'true'),
  (6, '#3, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.410560, 37.785545), 4326), '60 5th St', 16, 'true'),
  (2, '#3, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.407793, 37.783103), 4326), '944 Market St', 11, 'true'),
  (1, '#3, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.410001, 37.782008), 4326), '139 5th St', 1, 'true'),
  (4, '#3, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.408632, 37.783529), 4326), '989 Market St', 1, 'true'),
  (6, '#4, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.409271, 37.782031), 4326), '60 5th St', 16, 'true'),
  (2, '#4, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.407811, 37.785436), 4326), '944 Market St', 11, 'true'),
  (1, '#4, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.409804, 37.784271), 4326), '139 5th St', 1, 'true'),
  (4, '#4, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.408861, 37.783026), 4326), '989 Market St', 1, 'true'),
  (6, '#5, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.411247, 37.783671), 4326), '60 5th St', 16, 'true'),
  (2, '#5, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410705, 37.786082), 4326), '944 Market St', 11, 'true'),
  (1, '#5, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.409349, 37.783392), 4326), '139 5th St', 1, 'true'),
  (4, '#5, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410401, 37.783820), 4326), '989 Market St', 1, 'true'),
  (6, '#6, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.409706, 37.783136), 4326), '60 5th St', 16, 'true'),
  (2, '#6, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410066, 37.785227), 4326), '944 Market St', 11, 'true'),
  (1, '#6, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.410826, 37.785532), 4326), '139 5th St', 1, 'true'),
  (4, '#6, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410855, 37.784377), 4326), '989 Market St', 1, 'true'),
  (6, '#7, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.407420, 37.785904), 4326), '60 5th St', 16, 'true'),
  (2, '#7, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.410600, 37.785493), 4326), '944 Market St', 11, 'true'),
  (1, '#7, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.411372, 37.784726), 4326), '139 5th St', 1, 'true'),
  (4, '#7, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.407592, 37.785468), 4326), '989 Market St', 1, 'true'),
  (6, '#8, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.408018, 37.784514), 4326), '60 5th St', 16, 'true'),
  (2, '#8, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.407890, 37.785809), 4326), '944 Market St', 11, 'true'),
  (1, '#8, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.410415, 37.785509), 4326), '139 5th St', 1, 'true'),
  (4, '#8, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.410005, 37.785745), 4326), '989 Market St', 1, 'true'),
  (6, '#9, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.410247, 37.784495), 4326), '60 5th St', 16, 'true'),
  (2, '#9, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.409124, 37.786069), 4326), '944 Market St', 11, 'true'),
  (1, '#9, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.410211, 37.785391), 4326), '139 5th St', 1, 'true'),
  (4, '#9, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.411310, 37.785225), 4326), '989 Market St', 1, 'true'),
  (6, '#10, What movie theater is the best around here? I want to see that new Fast and Furious movie!', ST_SetSRID(ST_MakePoint(-122.410318, 37.784182), 4326), '60 5th St', 16, 'true'),
  (2, '#10, What floor is the Hack Reactor algorithms meetup on?', ST_SetSRID(ST_MakePoint(-122.408256, 37.784648), 4326), '944 Market St', 11, 'true'),
  (1, '#10, Is Chipotle still open?', ST_SetSRID(ST_MakePoint(-122.409896, 37.782160), 4326), '139 5th St', 1, 'true'),
  (4, '#10, Chipotle still got dat guac?', ST_SetSRID(ST_MakePoint(-122.409748, 37.784304), 4326), '989 Market St', 1, 'true');






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
  ('Advice'),
  ('Animals'),
  ('Business'),
  ('Concerts'),
  ('Convention'),
  ('Education'),
  ('Emergency'),
  ('Food'),
  ('Health'),
  ('History'),
  ('Life'),
  ('Love'),
  ('Movies'),
  ('Music'),
  ('News'),
  ('Politics'),
  ('Sports'),
  ('TV'),
  ('Tech'),
  ('Tourism'),
  ('Traffic');
