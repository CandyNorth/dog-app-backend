const { 
    selectAllDogPics, 
    selectDogPicById, 
    selectDogPicsByUserId 
} = require('../models/dog-pics-models');

exports.getDogPics = (req, res, next) => {
    selectAllDogPics()
        .then((dog_pictures) => {
            res.status(200).json({ dog_pictures });
        })
        .catch(next);
};

exports.getDogPicById = (req, res, next) => {
    const { picture_id } = req.params;
    selectDogPicById(picture_id)
        .then((dog_picture) => {
            res.status(200).json({ dog_picture });
        })
        .catch(next);
};

exports.getDogPicsByUserId = (req, res, next) => {
    const { user_id } = req.params;
    selectDogPicsByUserId(user_id)
        .then((dog_pictures) => {
            res.status(200).json({ dog_pictures });
        })
        .catch(next);
};