const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/users', () => {
    it('responds with a 200 status and an array of objects', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body.users)).toBe(true)
                response.body.users.forEach((user) => {
                    expect(user).toEqual(expect.objectContaining({
                        user_id: expect.any(Number),
                        username: expect.any(String),
                        email: expect.any(String),
                        avatar_url: expect.any(String),
                        created_at: expect.any(String)
                    }))
                })
            })
    })
});

describe('GET /api/users/:user_id', () => {
    it('responds with a 200 status and a single user object', () => {
        return request(app)
            .get('/api/users/1')
            .expect(200)
            .then((response) => {
                expect(response.body.user).toEqual(
                    expect.objectContaining({
                        user_id: 1,
                        username: expect.any(String),
                        email: expect.any(String),
                        avatar_url: expect.any(String),
                        created_at: expect.any(String)
                    })
                )
            })
    });

    it('responds with a 404 status when user does not exist', () => {
        return request(app)
            .get('/api/users/999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('User not found')
            })
    });

    it('responds with a 400 status when user_id is invalid', () => {
        return request(app)
            .get('/api/users/not-a-number')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
    });
});

describe('GET /api/dog_pictures', () => {
    it('responds with a 200 status and an array of objects', () => {
        return request(app)
            .get('/api/dog_pictures')
            .expect(200)
            .then((response) => {
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body.dog_pictures)).toBe(true)
                response.body.dog_pictures.forEach((dog_picture) => {
                    expect(dog_picture).toEqual(expect.objectContaining({
                        picture_id: expect.any(Number),
                        user_id: expect.any(Number),
                        first_guess_breed: expect.any(String),
                        second_guess_breed: expect.any(String),
                        third_guess_breed: expect.any(String),
                        first_guess_confidence: expect.any(Number),
                        second_guess_confidence: expect.any(Number),
                        third_guess_confidence: expect.any(Number),
                        uploaded_at: expect.any(String)
                    }))
                })
            })
    })
});

describe('GET /api/dog_pictures/:picture_id', () => {
    it('responds with a 200 status and a single dog picture object with first guess only', () => {
        return request(app)
            .get('/api/dog_pictures/1')
            .expect(200)
            .then((response) => {
                expect(response.body.dog_picture).toEqual(
                    expect.objectContaining({
                        picture_id: 1,
                        first_guess_breed: expect.any(String),
                        first_guess_confidence: expect.any(Number)
                    })
                );
                expect(response.body.dog_picture).not.toHaveProperty('second_guess_breed');
                expect(response.body.dog_picture).not.toHaveProperty('third_guess_breed');
            })
    });

    it('responds with a 404 status when picture does not exist', () => {
        return request(app)
            .get('/api/dog_pictures/999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Dog picture not found')
            })
    });

    it('responds with a 400 status when picture_id is invalid', () => {
        return request(app)
            .get('/api/dog_pictures/not-a-number')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
    });
});

describe('GET /api/dog_pictures/user/:user_id', () => {
    it('responds with a 200 status and an array of dog pictures for the specified user with first guesses only', () => {
        return request(app)
            .get('/api/dog_pictures/user/1')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.dog_pictures)).toBe(true);
                response.body.dog_pictures.forEach((dog_picture) => {
                    expect(dog_picture).toEqual(
                        expect.objectContaining({
                            picture_id: expect.any(Number),
                            first_guess_breed: expect.any(String),
                            first_guess_confidence: expect.any(Number)
                        })
                    );
                    expect(dog_picture).not.toHaveProperty('second_guess_breed');
                    expect(dog_picture).not.toHaveProperty('third_guess_breed');
                });
                const allBelongToUser = response.body.dog_pictures.every(
                    (picture) => picture.user_id === 1
                );
                expect(allBelongToUser).toBe(true);
            })
    });

    it('responds with an empty array when user has no pictures', () => {
        return request(app)
            .get('/api/dog_pictures/user/999')
            .expect(200)
            .then((response) => {
                expect(response.body.dog_pictures).toEqual([])
            })
    });

    it('responds with a 400 status when user_id is invalid', () => {
        return request(app)
            .get('/api/dog_pictures/user/not-a-number')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request')
            })
    });
});

describe('GET /api/users/:user_id/stats', () => {
    it('responds with a 200 status and user statistics', () => {
        return request(app)
            .get('/api/users/1/stats')
            .expect(200)
            .then((response) => {
                expect(response.body.stats).toEqual(
                    expect.objectContaining({
                        user_id: 1,
                        username: expect.any(String),
                        total_pictures: expect.any(Number),
                        unique_breeds_found: expect.any(Number),
                        score: expect.any(Number)
                    })
                );
                expect(response.body.stats.score).toBe(
                    response.body.stats.total_pictures * response.body.stats.unique_breeds_found
                );
            });
    });

    it('responds with a 404 status when user does not exist', () => {
        return request(app)
            .get('/api/users/999/stats')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('User not found');
            });
    });

    it('responds with a 400 status when user_id is invalid', () => {
        return request(app)
            .get('/api/users/not-a-number/stats')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
            });
    });
});

describe('GET /api/users/leaderboard', () => {
    it('responds with a 200 status and top 3 users', () => {
        return request(app)
            .get('/api/users/leaderboard')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.leaderboard)).toBe(true);
                expect(response.body.leaderboard.length).toBeLessThanOrEqual(3);
                
                response.body.leaderboard.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            user_id: expect.any(Number),
                            username: expect.any(String),
                            total_pictures: expect.any(Number),
                            unique_breeds_found: expect.any(Number),
                            score: expect.any(Number)
                        })
                    );
                    expect(user.score).toBe(user.total_pictures * user.unique_breeds_found);
                });
                const scores = response.body.leaderboard.map(user => user.score);
                const sortedScores = [...scores].sort((a, b) => b - a);
                expect(scores).toEqual(sortedScores);
            });
    });
});
describe('GET /api/users/leaderboard/monthly', () => {
    it('responds with a 200 status and monthly winners', () => {
        return request(app)
            .get('/api/users/leaderboard/monthly')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.leaderboard)).toBe(true);
                response.body.leaderboard.forEach((entry) => {
                    expect(entry).toEqual(
                        expect.objectContaining({
                            month_year: expect.stringMatching(/^\d{4}-\d{2}$/),
                            user_id: expect.any(Number),
                            username: expect.any(String),
                            total_pictures: expect.any(Number),
                            unique_breeds_found: expect.any(Number),
                            score: expect.any(Number)
                        })
                    );
                    expect(entry.month_year).toBe('2024-11');
                    expect(entry.score).toBe(entry.total_pictures * entry.unique_breeds_found);
                });
            });
    });
});

describe('GET /api/users/:user_id/stats/:month_year', () => {
    it('responds with a 200 status and user stats for specified month', () => {
        return request(app)
            .get('/api/users/1/stats/2024-11')
            .expect(200)
            .then((response) => {
                expect(response.body.stats).toEqual(
                    expect.objectContaining({
                        user_id: 1,
                        username: expect.any(String),
                        month_year: '2024-11',
                        total_pictures: expect.any(Number),
                        unique_breeds_found: expect.any(Number),
                        score: expect.any(Number),
                        pictures: expect.any(Array)
                    })
                );
                expect(response.body.stats.score).toBe(
                    response.body.stats.total_pictures * response.body.stats.unique_breeds_found
                );
                if (response.body.stats.pictures.length > 0) {
                    response.body.stats.pictures.forEach((picture) => {
                        expect(picture).toEqual(
                            expect.objectContaining({
                                picture_id: expect.any(Number),
                                breed: expect.any(String),
                                confidence: expect.any(Number)
                            })
                        );
                    });
                }
            });
    });

    it('responds with a 404 status when no stats exist for that month', () => {
        return request(app)
            .get('/api/users/1/stats/2024-01')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('No stats found for user 1 in 2024-01');
            });
    });

    it('responds with a 400 status when month_year format is invalid', () => {
        return request(app)
            .get('/api/users/1/stats/not-a-date')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Invalid format. Please use YYYY-MM');
            });
    });

    it('responds with a 400 status when user_id is invalid', () => {
        return request(app)
            .get('/api/users/not-a-number/stats/2024-11')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad request');
            });
    });
});