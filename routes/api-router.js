const apiRouter = require("express").Router();
const dogPicsRouter = require("./dog-pics-router");
const usersRouter = require('./users-router');

apiRouter.use('/users', usersRouter);
apiRouter.use('/dog_pictures', dogPicsRouter);

module.exports = apiRouter;