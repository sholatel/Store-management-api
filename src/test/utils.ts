import  User from '../modules/user/schemas/user.schema';
import jwt from 'jsonwebtoken';

export const createTestUser = async (isEmailVerified=true) => {
  return await User.create({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    isEmailVerified
  });
};
