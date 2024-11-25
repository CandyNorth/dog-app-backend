const {selectAllDogPics} = require('../models/dog-pics-models')

exports.getDogPics = (req, res, next) => {
    return selectAllDogPics()
    .then((dog_pictures) => {
        res.status(200).send({ dog_pictures });
    })
    .catch(next);
}