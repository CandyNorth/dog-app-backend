const { 
    selectAllUsers, 
    selectUserById, 
    selectUserStats,
    selectLeaderboard,
    selectMonthlyLeaderboard,
    selectUserMonthlyStats
} = require('../models/users-models');

exports.getUsers = (req, res, next) => {
    selectAllUsers()
        .then((users) => {
            res.status(200).json({ users });
        })
        .catch(next);
};

exports.getUserById = (req, res, next) => {
    const { user_id } = req.params;
    selectUserById(user_id)
        .then((user) => {
            res.status(200).json({ user });
        })
        .catch(next);
};

exports.getUserStats = (req, res, next) => {
    const { user_id } = req.params;
    selectUserStats(user_id)
        .then((stats) => {
            res.status(200).json({ stats });
        })
        .catch(next);
};

exports.getLeaderboard = (req, res, next) => {
    selectLeaderboard()
        .then((leaderboard) => {
            res.status(200).json({ leaderboard });
        })
        .catch(next);
};

exports.getMonthlyLeaderboard = (req, res, next) => {
    selectMonthlyLeaderboard()
        .then((leaderboard) => {
            res.status(200).json({ leaderboard });
        })
        .catch(next);
};

exports.getUserMonthlyStats = (req, res, next) => {
    const { user_id, month_year } = req.params;
    
    // Validate month_year format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(month_year)) {
        return res.status(400).json({ 
            msg: 'Invalid format. Please use YYYY-MM' 
        });
    }
    
    selectUserMonthlyStats(user_id, month_year)
        .then((stats) => {
            res.status(200).json({ stats });
        })
        .catch(next);
};