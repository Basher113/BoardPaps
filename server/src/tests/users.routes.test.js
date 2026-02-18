/**
 * Users Routes Test Suite
 * 
 * Layer: Route Layer
 * File: server/src/routes/users.routes.js
 * 
 * This test suite covers all routes in the users router:
 * - GET /users/me - Get current user data
 * - GET /users/me/invitations - Get user invitations
 * - GET /users/me/invitations/count - Get invitation count  
 * - POST /users/me/invitations/:invitationId/accept - Accept invitation
 * - POST /users/me/invitations/:invitationId/decline - Decline invitation
 * - GET /users/me/profile - Get user profile
 * - PUT /users/me/profile - Update user profile
 * - PUT /users/me/avatar - Update user avatar
 * - DELETE /users/me/avatar - Delete user avatar
 * - DELETE /users/me - Delete user account
 */

const request = require('supertest');
const express = require('express');
const prisma = require('../lib/prisma');

// Mock Clerk authentication
jest.mock('@clerk/express', () => ({
  clerkMiddleware: jest.fn((req, res, next) => {
    if (req.headers['x-mock-user-id']) {
      req.auth = { userId: req.headers['x-mock-user-id'] };
    }
    next();
  }),
  requireAuth: jest.fn(() => (req, res, next) => {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }),
  clerkClient: {
    users: {
      updateUser: jest.fn().mockResolvedValue({}),
      getUser: jest.fn().mockResolvedValue({
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        username: 'testuser',
        imageUrl: 'https://example.com/avatar.jpg',
      }),
      deleteUser: jest.fn().mockResolvedValue({}),
    },
  },
}));

// Mock Cloudinary
jest.mock('../config/cloudinary.config', () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

// Now require the routes
const usersRouter = require('../routes/users.routes');

// Create test app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock auth middleware - populate req.user from database
app.use(async (req, res, next) => {
  if (req.headers['x-mock-user-id']) {
    req.auth = { userId: req.headers['x-mock-user-id'] };
    
    // Get user from database using clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: req.headers['x-mock-user-id'] },
    });
    
    if (user) {
      req.user = user;
    }
  }
  next();
});

app.use('/users', usersRouter);

describe('Users Routes Test Suite', () => {
  // Test user data
  const testClerkId = 'test_clerk_user_' + Date.now();
  const testEmail = `test_${Date.now()}@example.com`;
  const testUsername = 'testuser_' + Date.now();

  // Create test user before all tests
  beforeAll(async () => {
    // Create a test user in the database
    await prisma.user.create({
      data: {
        clerkId: testClerkId,
        email: testEmail,
        username: testUsername,
        avatar: null,
      },
    });
  });

  // Delete test data after all tests
  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({
      where: {
        clerkId: testClerkId,
      },
    }); // Ignore if not found
    
    await prisma.$disconnect();
  });

  // Delete test data before each test
  beforeEach(async () => {
    // Ensure test user exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: testClerkId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId: testClerkId,
          email: testEmail,
          username: testUsername,
          avatar: null,
        },
      });
    }
  });

  describe('Authentication Tests', () => {
    test('GET /users/me should return 401 without auth', async () => {
      const response = await request(app).get('/users/me');
      expect(response.status).toBe(401);
    });

    test('GET /users/me/profile should return 401 without auth', async () => {
      const response = await request(app).get('/users/me/profile');
      expect(response.status).toBe(401);
    });

    test('PUT /users/me/profile should return 401 without auth', async () => {
      const response = await request(app)
        .put('/users/me/profile')
        .send({ username: 'newuser' });
      expect(response.status).toBe(401);
    });

    test('PUT /users/me/avatar should return 401 without auth', async () => {
      const response = await request(app).put('/users/me/avatar');
      expect(response.status).toBe(401);
    });

    test('DELETE /users/me/avatar should return 401 without auth', async () => {
      const response = await request(app).delete('/users/me/avatar');
      expect(response.status).toBe(401);
    });

    test('DELETE /users/me should return 401 without auth', async () => {
      const response = await request(app).delete('/users/me');
      expect(response.status).toBe(401);
    });

    test('GET /users/me/invitations should return 401 without auth', async () => {
      const response = await request(app).get('/users/me/invitations');
      expect(response.status).toBe(401);
    });

    test('GET /users/me/invitations/count should return 401 without auth', async () => {
      const response = await request(app).get('/users/me/invitations/count');
      expect(response.status).toBe(401);
    });

    test('POST /users/me/invitations/:invitationId/accept should return 401 without auth', async () => {
      const response = await request(app).post('/users/me/invitations/inv-123/accept');
      expect(response.status).toBe(401);
    });

    test('POST /users/me/invitations/:invitationId/decline should return 401 without auth', async () => {
      const response = await request(app).post('/users/me/invitations/inv-123/decline');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /users/me - Get Current User Data', () => {
    test('should return current user data with valid auth', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', testEmail);
      expect(response.body).toHaveProperty('username', testUsername);
    });
  });

  describe('GET /users/me/profile - Get User Profile', () => {
    test('should return user profile with valid auth', async () => {
      const response = await request(app)
        .get('/users/me/profile')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', testEmail);
      expect(response.body).toHaveProperty('username', testUsername);
    });
  });

  describe('PUT /users/me/profile - Update User Profile', () => {
    test('should update username successfully', async () => {
      const newUsername = 'updateduser_' + Date.now();
      
      const response = await request(app)
        .put('/users/me/profile')
        .set('x-mock-user-id', testClerkId)
        .send({ username: newUsername, email: testEmail });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', newUsername);
    });

    test('should return 400 for duplicate username', async () => {
      // First create another user with a username
      const otherClerkId = 'test_other_clerk_' + Date.now();
      const otherEmail = `other_${Date.now()}@example.com`;
      const otherUsername = 'otheruser_' + Date.now();
      
      await prisma.user.create({
        data: {
          clerkId: otherClerkId,
          email: otherEmail,
          username: otherUsername,
          avatar: null,
        },
      });

      // Try to update to that username
      const response = await request(app)
        .put('/users/me/profile')
        .set('x-mock-user-id', testClerkId)
        .send({ username: otherUsername, email: testEmail });

      expect(response.status).toBe(400);
      expect(response.body.errors.username).toContain('Username already taken');

     
    });

    test('should return 400 for invalid username (too short)', async () => {
      const response = await request(app)
        .put('/users/me/profile')
        .set('x-mock-user-id', testClerkId)
        .send({ username: 'ab', email: testEmail });

      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid username (invalid characters)', async () => {
      const response = await request(app)
        .put('/users/me/profile')
        .set('x-mock-user-id', testClerkId)
        .send({ username: 'user@#$%', email: testEmail });

      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .put('/users/me/profile')
        .set('x-mock-user-id', testClerkId)
        .send({ username: 'validuser', email: 'not-an-email' });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /users/me/avatar - Update Avatar', () => {
    test('should return 400 when no file is uploaded', async () => {
      const response = await request(app)
        .put('/users/me/avatar')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'No file uploaded');
    });
  });

  describe('DELETE /users/me/avatar - Delete Avatar', () => {
    test('should delete avatar successfully when no avatar exists', async () => {
      // First set avatar to null (already null for test user)
      await prisma.user.update({
        where: { clerkId: testClerkId },
        data: { avatar: null },
      });

      const response = await request(app)
        .delete('/users/me/avatar')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /users/me - Delete Account', () => {
    test('should delete account successfully', async () => {
      // Create a temporary user to delete
      const tempClerkId = 'test_delete_' + Date.now();
      const tempEmail = `delete_${Date.now()}@example.com`;
      const tempUsername = 'deleteuser_' + Date.now();

      await prisma.user.create({
        data: {
          clerkId: tempClerkId,
          email: tempEmail,
          username: tempUsername,
          avatar: null,
        },
      });

      const response = await request(app)
        .delete('/users/me')
        .set('x-mock-user-id', tempClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Account deleted successfully');

      // Verify user is deleted
      const deletedUser = await prisma.user.findUnique({
        where: { clerkId: tempClerkId },
      });
      expect(deletedUser).toBeNull();
    });
  });

  describe('Invitation Routes', () => {
    test('GET /users/me/invitations should return success response', async () => {
      const response = await request(app)
        .get('/users/me/invitations')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });

    test('GET /users/me/invitations/count should return success response', async () => {
      const response = await request(app)
        .get('/users/me/invitations/count')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });

    test('POST /users/me/invitations/:invitationId/accept should return 404 for non-existent invitation', async () => {
      const response = await request(app)
        .post('/users/me/invitations/non-existent-id/accept')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(404);
    });

    test('POST /users/me/invitations/:invitationId/decline should return 404 for non-existent invitation', async () => {
      const response = await request(app)
        .post('/users/me/invitations/non-existent-id/decline')
        .set('x-mock-user-id', testClerkId);

      expect(response.status).toBe(404);
    });
  });
});
