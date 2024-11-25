const dogPicsRouter = require('express').Router();
const { getDogPics } = require('../controllers/dog-pics-controllers');

dogPicsRouter.get('/', getDogPics)

module.exports = dogPicsRouter;