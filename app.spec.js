const request = require('supertest');

const app = require('./app');

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

test('GET / should return 200', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
});

describe('Protected API /api/v1/me', () => {
  let userSpy;

  beforeAll(() => {
    const { User } = require('./db');
    userSpy = jest.spyOn(User, 'findOrCreate').mockImplementation(() => {
      return {
        id: 1212,
        name: {
          familyName: 'Doe',
          givenName: 'John'
        }
      };
    });
  });

  afterAll(() => {
    userSpy.mockRestore();
  });

  test('GET /api/v1/me should return 401', async () => {
    const response = await request(app).get('/api/v1/me');
    expect(response.statusCode).toBe(401);
  });

  test('GET /api/v1/me?access_token=<token> should return 200', async () => {
    const response = await request(app).get('/api/v1/me?access_token=123456');
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/v1/me?access_token=<token> should return user information', async () => {
    const response = await request(app).get('/api/v1/me?access_token=123456');
    expect(response.statusCode).toBe(200);
    
    const user = response.body;
    expect(user).toBeDefined();
    expect(user.id).toBe(1212);
    expect(user.name.familyName).toBe('Doe');
    expect(user.name.givenName).toBe('John');
  });
});
