const {selectAllUsers} = require('../models/users-models')

exports.getUsers = (req, res, next) => {
    return selectAllUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch(next);
}