// Test setup file
// This file is used by Jest to set up the test environment

// Mock Clerk authentication
jest.mock('@clerk/express', () => ({
  clerkMiddleware: jest.fn((req, res, next) => {
    // Mock req.auth for authenticated requests
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

// Mock Cloudinary (optional - only if you need to test without actual uploads)
jest.mock('../config/cloudinary.config', () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    },
  },
}));

// Global test variables
global.testUser = {
  id: 'user-123',
  clerkId: 'clerk-user-123',
  email: 'test@example.com',
  username: 'testuser',
  avatar: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
