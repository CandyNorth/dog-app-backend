const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ users, dogPictures }) => {
  return db
    .query(`DROP TABLE IF EXISTS dog_pictures;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      const usersTablePromise = db.query(
        `
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
      );

      const dogPicturesTablePromise = db.query(`
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
    );`);
      return Promise.all([usersTablePromise, dogPicturesTablePromise])
    })
    .then(() => {
      const formattedUsers = users.map(convertTimestampToDate)
      const insertUsersQueryStr = format(
        'INSERT INTO users (username, email, created_at) VALUES %L;',
        formattedUsers.map(({ username, email, created_at}) => [
          username, email, created_at
        ])
      )
      const usersPromise = db.query(insertUsersQueryStr)
      const formattedDogPics = dogPictures.map(convertTimestampToDate)
      const insertdogPicturesQueryStr = format(
        'INSERT INTO dog_pictures (user_id, image_url, first_guess_breed, second_guess_breed, third_guess_breed, first_guess_confidence, second_guess_confidence, third_guess_confidence) VALUES %L;',
        formattedDogPics.map(({ user_id, image_url, first_guess_breed, second_guess_breed, third_guess_breed, first_guess_confidence, second_guess_confidence, third_guess_confidence }) => [
          user_id, image_url, first_guess_breed, second_guess_breed, third_guess_breed, first_guess_confidence, second_guess_confidence, third_guess_confidence
        ])
      )
      const dogPicturesPromise = db.query(insertdogPicturesQueryStr)
      return Promise.all([usersPromise, dogPicturesPromise])
    })
};
