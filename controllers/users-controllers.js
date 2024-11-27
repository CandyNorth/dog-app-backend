const { uploadToS3 } = require('../db/seeds/utils');
const { 
    selectAllUsers, 
    selectUserById, 
    selectUserStats,
    selectLeaderboard,
    selectMonthlyLeaderboard,
    selectUserMonthlyStats,
    updateUserAvatar
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

exports.patchUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file provided' });
    }

    const { user_id } = req.params;
    const avatarUrl = await uploadToS3(req.file.buffer, req.file.originalname, 'avatars');
    const updatedUser = await updateUserAvatar(user_id, avatarUrl);

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};