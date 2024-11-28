const db = require('../db/connection')

exports.selectAllUsers = () => {
    return db.query('SELECT * FROM users;')
        .then((result) => {
            return result.rows;
        })
}

exports.selectUserById = (userId) => {
    return db.query('SELECT * FROM users WHERE user_id = $1;', [userId])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found' });
            }
            return result.rows[0];
        });
}

exports.selectUserByEmail = (email) => {
    return db.query('SELECT * FROM users WHERE email = $1;', [email])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found' });
            }
            return result.rows[0];
        });
}
exports.selectUserByFirebase = (firebase) => {
    return db.query('SELECT * FROM users WHERE firebase = $1;', [firebase])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found' });
            }
            return result.rows[0];
        });
}

exports.selectUserStats = (userId) => {
    const query = `
        SELECT 
            u.user_id,
            u.username,
            CAST(COUNT(DISTINCT dp.picture_id) AS INTEGER) as total_pictures,
            CAST(COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as unique_breeds_found,
            CAST(COUNT(DISTINCT dp.picture_id) * COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as score
        FROM users u
        LEFT JOIN dog_pictures dp ON u.user_id = dp.user_id
        WHERE u.user_id = $1
        GROUP BY u.user_id, u.username;
    `;
    
    return db.query(query, [userId])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found' });
            }
            return result.rows[0];
        });
}

exports.selectLeaderboard = () => {
    const query = `
        SELECT 
            u.user_id,
            u.username,
            u.avatar_url,
            CAST(COUNT(DISTINCT dp.picture_id) AS INTEGER) as total_pictures,
            CAST(COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as unique_breeds_found,
            CAST(COUNT(DISTINCT dp.picture_id) * COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as score
        FROM users u
        LEFT JOIN dog_pictures dp ON u.user_id = dp.user_id
        GROUP BY u.user_id, u.username
        ORDER BY score DESC
        LIMIT 3;
    `;
    
    return db.query(query)
        .then((result) => {
            return result.rows;
        });
}

exports.selectMonthlyLeaderboard = () => {
    const query = `
        WITH monthly_scores AS (
            SELECT 
                u.user_id,
                u.username,
                TO_CHAR(dp.uploaded_at, 'YYYY-MM') as month_year,
                CAST(COUNT(DISTINCT dp.picture_id) AS INTEGER) as total_pictures,
                CAST(COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as unique_breeds_found,
                CAST(COUNT(DISTINCT dp.picture_id) * COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as score,
                ROW_NUMBER() OVER (
                    PARTITION BY TO_CHAR(dp.uploaded_at, 'YYYY-MM')
                    ORDER BY COUNT(DISTINCT dp.picture_id) * COUNT(DISTINCT dp.first_guess_breed) DESC
                ) as rank
            FROM users u
            JOIN dog_pictures dp ON u.user_id = dp.user_id
            GROUP BY u.user_id, u.username, month_year
        )
        SELECT 
            month_year,
            user_id,
            username,
            total_pictures,
            unique_breeds_found,
            score
        FROM monthly_scores
        WHERE rank = 1
        ORDER BY month_year DESC;
    `;
    
    return db.query(query)
        .then((result) => {
            return result.rows;
        });
};

exports.selectUserMonthlyStats = (userId, monthYear) => {
    const query = `
        SELECT 
            u.user_id,
            u.username,
            TO_CHAR(dp.uploaded_at, 'YYYY-MM') as month_year,
            CAST(COUNT(DISTINCT dp.picture_id) AS INTEGER) as total_pictures,
            CAST(COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as unique_breeds_found,
            CAST(COUNT(DISTINCT dp.picture_id) * COUNT(DISTINCT dp.first_guess_breed) AS INTEGER) as score,
            json_agg(
                json_build_object(
                    'picture_id', dp.picture_id,
                    'breed', dp.first_guess_breed,
                    'confidence', dp.first_guess_confidence
                )
            ) as pictures
        FROM users u
        LEFT JOIN dog_pictures dp ON u.user_id = dp.user_id
        WHERE u.user_id = $1 
        AND TO_CHAR(dp.uploaded_at, 'YYYY-MM') = $2
        GROUP BY u.user_id, u.username, month_year;
    `;
    
    return db.query(query, [userId, monthYear])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ 
                    status: 404, 
                    msg: `No stats found for user ${userId} in ${monthYear}` 
                });
            }
            return result.rows[0];
        });
};

exports.updateUserAvatar = (userId, avatarUrl) => {
    return db
      .query(
        'UPDATE users SET avatar_url = $1 WHERE user_id = $2 RETURNING *;',
        [avatarUrl, userId]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'User not found' });
        }
        return result.rows[0];
      });
  };