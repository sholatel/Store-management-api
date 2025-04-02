import request from 'supertest';
import app from '../../../app';
import  User  from '../schemas/user.schema';
import { createTestUser } from '../../../test/utils';
import signToken from '../../../utils/signToken';

describe('User Controller', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        })
        .expect(201);
        //console.log("Response:", response.body)
      expect(response.body.data.user.email).toBe('newuser@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should fail with invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          name: 'N',
          email: 'invalid-email',
          password: 'short',
        })
        .expect(400);

      expect(response.statusCode).toEqual(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await createTestUser();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'password123'
        })
        .expect(200);

      expect(response.body.data.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('GET /user/me', () => {
    it('should return current user data', async () => {
      const testUser = await createTestUser();
      const token = signToken(testUser._id?.toString());

      const response = await request(app)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should fail without authentication', async () => {
      await request(app)
        .get('/api/v1/user/me')
        .expect(401);
    });
  });
});