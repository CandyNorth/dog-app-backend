const usersRouter = require('express').Router();
const { 
    getUsers, 
    getUserById, 
    getUserStats,
    getLeaderboard,
    getMonthlyLeaderboard,
    getUserMonthlyStats
} = require('../controllers/users-controllers');

usersRouter.get('/', getUsers);
usersRouter.get('/leaderboard', getLeaderboard);
usersRouter.get('/:user_id', getUserById);
usersRouter.get('/:user_id/stats', getUserStats);

//monthly leaderboard stuff
usersRouter.get('/leaderboard/monthly', getMonthlyLeaderboard);
usersRouter.get('/:user_id/stats/:month_year', getUserMonthlyStats);

module.exports = usersRouter;