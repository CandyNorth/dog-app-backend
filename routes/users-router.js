const usersRouter = require('express').Router();
const { 
    getUsers, 
    getUserById, 
    getUserStats,
    getLeaderboard,
    getMonthlyLeaderboard,
    getUserMonthlyStats,
    patchUserAvatar,
    getUserByEmail,
    getUserByFirebase
} = require('../controllers/users-controllers');
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

usersRouter.get('/', getUsers);
usersRouter.get('/leaderboard', getLeaderboard);
usersRouter.get('/:user_id', getUserById);
usersRouter.get('/email/:email', getUserByEmail);
usersRouter.get('/firebase/:firebase', getUserByFirebase);
usersRouter.get('/:user_id/stats', getUserStats);
usersRouter.patch('/:user_id/avatar', upload.single('avatar'), patchUserAvatar);

//monthly leaderboard stuff
usersRouter.get('/leaderboard/monthly', getMonthlyLeaderboard);
usersRouter.get('/:user_id/stats/:month_year', getUserMonthlyStats);

module.exports = usersRouter;