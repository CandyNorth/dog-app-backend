const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
//const endpoints = require('../endpoints.json');

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
                        created_at: expect.any(String)
                    }))
                })
            })
    })
})

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
})


