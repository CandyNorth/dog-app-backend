const db = require("../db/connection");

exports.insertDogPicture = async ({ userId, imageUrl, predictions }) => {
  const query = `
        INSERT INTO dog_pictures 
        (user_id, image_url, 
         first_guess_breed, first_guess_confidence,
         second_guess_breed, second_guess_confidence,
         third_guess_breed, third_guess_confidence)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

  const values = [
    userId,
    imageUrl,
    predictions[0].breed,
    predictions[0].confidence,
    predictions[1].breed,
    predictions[1].confidence,
    predictions[2].breed,
    predictions[2].confidence,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

exports.selectAllDogPics = () => {
  return db.query("SELECT * FROM dog_pictures;").then((result) => {
    return result.rows;
  });
};

exports.selectDogPicById = (pictureId) => {
    return db.query(
        'SELECT picture_id, first_guess_breed, first_guess_confidence FROM dog_pictures WHERE picture_id = $1;',
        [pictureId]
    ).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Dog picture not found' });
        }
        return result.rows[0];
    });
};

exports.selectDogPicsByUserId = (userId) => {
    return db.query(
        'SELECT picture_id, user_id, first_guess_breed, first_guess_confidence FROM dog_pictures WHERE user_id = $1;',
        [userId]
    ).then((result) => {
        return result.rows;
    });
};
