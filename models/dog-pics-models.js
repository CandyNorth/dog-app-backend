const db = require('../db/connection')

exports.selectAllDogPics = () => {
    return db.query('SELECT * FROM dog_pictures;')
        .then((result) => {
            return result.rows;
        })
}