const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("./utils");

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
          firebase VARCHAR(100) UNIQUE NOT NULL,
          avatar_url TEXT DEFAULT 'https://dog-breed-id-ml-model.s3.us-east-1.amazonaws.com/avatars/default-avatar.jpg' NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );`
      );
      return usersTablePromise
    })
    .then(() => {
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
          uploaded_at TIMESTAMP DEFAULT NOW() NOT NULL
    );`);
        return dogPicturesTablePromise
    })
     
    .then(() => {
      const formattedUsers = users.map(convertTimestampToDate);
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, email, firebase) VALUES %L;",
        formattedUsers.map(({ username, email, firebase }) => [
          username,
          email,
          firebase,
        ])
      );
      return db.query(insertUsersQueryStr);
    })
      .then(() => {
        const formattedDogPics = dogPictures.map(convertTimestampToDate);
        const insertdogPicturesQueryStr = format(
          "INSERT INTO dog_pictures (user_id, image_url, first_guess_breed, second_guess_breed, third_guess_breed, first_guess_confidence, second_guess_confidence, third_guess_confidence) VALUES %L;",
          formattedDogPics.map(
            ({
              user_id,
              image_url,
              first_guess_breed,
              second_guess_breed,
              third_guess_breed,
              first_guess_confidence,
              second_guess_confidence,
              third_guess_confidence,
            }) => [
              user_id,
              image_url,
              first_guess_breed,
              second_guess_breed,
              third_guess_breed,
              first_guess_confidence,
              second_guess_confidence,
              third_guess_confidence,
            ]
          )
        );
        return db.query(insertdogPicturesQueryStr);
      })
    .catch((error) => {
      console.error("Error while seeding database:", error);
      throw error;
    });
};

module.exports = seed;
