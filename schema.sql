DROP DATABASE IF EXISTS doggy_db;
CREATE DATABASE doggy_db;
\c doggy_db;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dog_pictures (
    picture_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    image_url TEXT NOT NULL,
    first_guess_breed TEXT,
    second_guess_breed TEXT,
    third_guess_breed TEXT,
    first_guess_confidence FLOAT,
    second_guess_confidence FLOAT,
    third_guess_confidence FLOAT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- These are the columns:

-- --picture id 
-- --user id
-- --image imageurl 
-- --num 1 best guess breed of dog 
-- --num 1 best confidence 
-- --num 2 best guess breed of dog 
-- --num 2 best confidence 
-- --num 3 best guess breed of dog 
-- --num 3 best confidence 

-- [
--   {
--     "breed": "Chihuahua",
--     "confidence": 87.7
--   },
--   {
--     "breed": "toy_terrier",
--     "confidence": 2
--   },
--   {
--     "breed": "miniature_pinscher",
--     "confidence": 0.52
--   }
-- ]
