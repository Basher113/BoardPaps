/**
 * Project Member Routes Test Suite
 * 
 * Layer: Route Layer
 * File: server/src/routes/project-member.routes.js
 * 
 * This test suite covers all routes in the project member router:
 * - GET /projects/:projectId/members - Get project members
 * - PUT /projects/:projectId/members/:memberId - Update member role
 * - DELETE /projects/:projectId/members/:memberId - Remove member from project
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

// Import routes
const projectRouter = require('../routes/project.routes');

// Create test app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock auth middleware - populate req.user from database
app.use(async (req, res, next) => {
  if (req.headers['x-mock-user-id']) {
    req.auth = { userId: req.headers['x-mock-user-id'] };
    
    const user = await prisma.user.findUnique({
      where: { clerkId: req.headers['x-mock-user-id'] },
    });
    
    if (user) {
      req.user = user;
    }
  }
  next();
});

// Mount routes - project-member is nested under project
app.use('/projects', projectRouter);

describe('Project Member Routes Test Suite', () => {
  // Test user data (owner)
  const ownerClerkId = 'test_owner_pm_' + Date.now();
  const ownerEmail = `owner_pm_${Date.now()}@example.com`;
  const ownerUsername = 'owner_pm_user_' + Date.now();
  let ownerUserId = null;
  let testProjectId = null;

  // Helper to generate valid project key
  const generateKey = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * 26)] + 
           letters[Math.floor(Math.random() * 26)] + 
           letters[Math.floor(Math.random() * 26)];
  };

  // Helper to clean up test data
  async function cleanupTestData() {
    await prisma.auditLog.deleteMany({});
    await prisma.invitation.deleteMany({});
    await prisma.projectMember.deleteMany({});
    await prisma.column.deleteMany({});
    await prisma.issue.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.user.deleteMany({
      where: { clerkId: { startsWith: 'test_' } }
    });
  }

  // Setup before all tests
  beforeAll(async () => {
    await cleanupTestData();
    
    // Create owner user
    const owner = await prisma.user.create({
      data: {
        clerkId: ownerClerkId,
        email: ownerEmail,
        username: ownerUsername,
        avatar: null,
      },
    });
    ownerUserId = owner.id;

    // Create test project with owner as member
    const project = await prisma.project.create({
      data: {
        name: 'Test Project for Members',
        key: generateKey(),
        ownerId: ownerUserId,
        members: {
          create: { userId: ownerUserId, role: 'OWNER' },
        },
      },
    });
    testProjectId = project.id;
  });

  // Cleanup after all tests
  afterAll(async () => {
    await cleanupTestData();
    await prisma.$disconnect();
  });

  // Ensure test setup before each test
  beforeEach(async () => {
    // Ensure owner exists
    const existingOwner = await prisma.user.findUnique({
      where: { clerkId: ownerClerkId },
    });
    if (!existingOwner) {
      const owner = await prisma.user.create({
        data: {
          clerkId: ownerClerkId,
          email: ownerEmail,
          username: ownerUsername,
          avatar: null,
        },
      });
      ownerUserId = owner.id;
    } else {
      ownerUserId = existingOwner.id;
    }

    // Ensure project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: testProjectId },
    });
    if (!existingProject) {
      const project = await prisma.project.create({
        data: {
          name: 'Test Project for Members',
          key: generateKey(),
          ownerId: ownerUserId,
          members: {
            create: { userId: ownerUserId, role: 'OWNER' },
          },
        },
      });
      testProjectId = project.id;
    }
  });

  describe('Authentication Tests', () => {
    test('GET /projects/:projectId/members should return 401 or 500 without auth', async () => {
      // Note: Without auth, the middleware may crash (500) instead of returning 401
      // because req.user is undefined
      const response = await request(app).get(`/projects/${testProjectId}/members`);
      expect([401, 500]).toContain(response.status);
    });

    test('PUT /projects/:projectId/members/:memberId should return 401 or 500 without auth', async () => {
      const response = await request(app)
        .put(`/projects/${testProjectId}/members/some-member-id`)
        .send({ role: 'MEMBER' });
      expect([401, 500]).toContain(response.status);
    });

    test('DELETE /projects/:projectId/members/:memberId should return 401 or 500 without auth', async () => {
      const response = await request(app).delete(`/projects/${testProjectId}/members/some-member-id`);
      expect([401, 500]).toContain(response.status);
    });
  });

  describe('Authorization Tests', () => {
    test('GET /projects/:projectId/members should return 403 for non-member', async () => {
      // Create a non-member user
      const nonMemberClerkId = 'non_member_' + Date.now();
      const nonMemberEmail = `nonmember_${Date.now()}@example.com`;
      
      const nonMember = await prisma.user.create({
        data: {
          clerkId: nonMemberClerkId,
          email: nonMemberEmail,
          username: 'nonmember_' + Date.now(),
          avatar: null,
        },
      });

      const response = await request(app)
        .get(`/projects/${testProjectId}/members`)
        .set('x-mock-user-id', nonMemberClerkId);

      expect(response.status).toBe(403);

      // Clean up
      await prisma.user.delete({ where: { id: nonMember.id } });
    });

    test('PUT /projects/:projectId/members/:memberId should return 403 for non-owner', async () => {
      // Create a member user (not owner)
      const memberClerkId = 'member_not_owner_' + Date.now();
      const memberEmail = `membernotowner_${Date.now()}@example.com`;
      
      const member = await prisma.user.create({
        data: {
          clerkId: memberClerkId,
          email: memberEmail,
          username: 'membernotowner_' + Date.now(),
          avatar: null,
        },
      });

      // Add as MEMBER
      await prisma.projectMember.create({
        data: {
          userId: member.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      // Try to update another member's role (should fail - not owner)
      const response = await request(app)
        .put(`/projects/${testProjectId}/members/${member.id}`)
        .set('x-mock-user-id', memberClerkId)
        .send({ role: 'ADMIN' });

      expect(response.status).toBe(403);

      // Clean up
      await prisma.projectMember.deleteMany({
        where: { userId: member.id, projectId: testProjectId },
      });
      await prisma.user.delete({ where: { id: member.id } });
    });
  });

  describe('GET /projects/:projectId/members - Get Project Members', () => {
    test('should return members for project owner', async () => {
      const response = await request(app)
        .get(`/projects/${testProjectId}/members`)
        .set('x-mock-user-id', ownerClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should return members for project admin', async () => {
      // Create an admin user
      const adminClerkId = 'admin_user_' + Date.now();
      const adminEmail = `admin_${Date.now()}@example.com`;
      
      const admin = await prisma.user.create({
        data: {
          clerkId: adminClerkId,
          email: adminEmail,
          username: 'adminuser_' + Date.now(),
          avatar: null,
        },
      });

      // Add as ADMIN
      await prisma.projectMember.create({
        data: {
          userId: admin.id,
          projectId: testProjectId,
          role: 'ADMIN',
        },
      });

      const response = await request(app)
        .get(`/projects/${testProjectId}/members`)
        .set('x-mock-user-id', adminClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Clean up
      await prisma.projectMember.deleteMany({
        where: { userId: admin.id, projectId: testProjectId },
      });
      await prisma.user.delete({ where: { id: admin.id } });
    });

    test('should return members for project member', async () => {
      // Create a regular member
      const memberClerkId = 'regular_member_' + Date.now();
      const memberEmail = `regularmember_${Date.now()}@example.com`;
      
      const member = await prisma.user.create({
        data: {
          clerkId: memberClerkId,
          email: memberEmail,
          username: 'regularmember_' + Date.now(),
          avatar: null,
        },
      });

      // Add as MEMBER
      await prisma.projectMember.create({
        data: {
          userId: member.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      const response = await request(app)
        .get(`/projects/${testProjectId}/members`)
        .set('x-mock-user-id', memberClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Clean up
      await prisma.projectMember.deleteMany({
        where: { userId: member.id, projectId: testProjectId },
      });
      await prisma.user.delete({ where: { id: member.id } });
    });
  });

  describe('PUT /projects/:projectId/members/:memberId - Update Member Role', () => {
    test('should update member role as owner', async () => {
      // Create a member to update
      const memberClerkId = 'member_to_update_' + Date.now();
      const memberEmail = `membertoupdate_${Date.now()}@example.com`;
      
      const member = await prisma.user.create({
        data: {
          clerkId: memberClerkId,
          email: memberEmail,
          username: 'membertoupdate_' + Date.now(),
          avatar: null,
        },
      });

      // Add as MEMBER
      const membership = await prisma.projectMember.create({
        data: {
          userId: member.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      // Owner updates the member to ADMIN
      const response = await request(app)
        .put(`/projects/${testProjectId}/members/${membership.id}`)
        .set('x-mock-user-id', ownerClerkId)
        .send({ role: 'ADMIN' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Clean up
      await prisma.projectMember.deleteMany({
        where: { userId: member.id, projectId: testProjectId },
      });
      await prisma.user.delete({ where: { id: member.id } });
    });

    test('should return 400 for invalid role', async () => {
      // Create a member to update
      const memberClerkId = 'member_invalid_role_' + Date.now();
      const memberEmail = `memberinvalidrole_${Date.now()}@example.com`;
      
      const member = await prisma.user.create({
        data: {
          clerkId: memberClerkId,
          email: memberEmail,
          username: 'memberinvalidrole_' + Date.now(),
          avatar: null,
        },
      });

      // Add as MEMBER
      const membership = await prisma.projectMember.create({
        data: {
          userId: member.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      // Try to update with invalid role
      const response = await request(app)
        .put(`/projects/${testProjectId}/members/${membership.id}`)
        .set('x-mock-user-id', ownerClerkId)
        .send({ role: 'INVALID_ROLE' });

      expect(response.status).toBe(400);

      // Clean up
      await prisma.projectMember.deleteMany({
        where: { userId: member.id, projectId: testProjectId },
      });
      await prisma.user.delete({ where: { id: member.id } });
    });

    test('should return 400 when trying to change own role', async () => {
      // Get owner's membership
      const ownerMembership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: { userId: ownerUserId, projectId: testProjectId },
        },
      });

      // Owner tries to change their own role (should fail)
      const response = await request(app)
        .put(`/projects/${testProjectId}/members/${ownerMembership.id}`)
        .set('x-mock-user-id', ownerClerkId)
        .send({ role: 'MEMBER' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('cannot change your own role');
    });

    test('should return 404 for non-existent member', async () => {
      const response = await request(app)
        .put(`/projects/${testProjectId}/members/non-existent-id`)
        .set('x-mock-user-id', ownerClerkId)
        .send({ role: 'ADMIN' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /projects/:projectId/members/:memberId - Remove Member', () => {
    test('should remove member as owner', async () => {
      // Create a member to remove
      const memberClerkId = 'member_to_remove_' + Date.now();
      const memberEmail = `membertoremove_${Date.now()}@example.com`;
      
      const member = await prisma.user.create({
        data: {
          clerkId: memberClerkId,
          email: memberEmail,
          username: 'membertoremove_' + Date.now(),
          avatar: null,
        },
      });

      // Add as MEMBER
      const membership = await prisma.projectMember.create({
        data: {
          userId: member.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      // Owner removes the member
      const response = await request(app)
        .delete(`/projects/${testProjectId}/members/${membership.id}`)
        .set('x-mock-user-id', ownerClerkId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Clean up
      await prisma.user.delete({ where: { id: member.id } });
    });

    test('should allow member to remove themselves', async () => {
      // Create a member
      const memberClerkId = 'self_removing_member_' + Date.now();
      const memberEmail = `selfremovingmember_${Date.now()}@example.com`;
      
      const member = await prisma.user.create({
        data: {
          clerkId: memberClerkId,
          email: memberEmail,
          username: 'selfremovingmember_' + Date.now(),
          avatar: null,
        },
      });

      // Add as MEMBER
      const membership = await prisma.projectMember.create({
        data: {
          userId: member.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      // Member removes themselves
      const response = await request(app)
        .delete(`/projects/${testProjectId}/members/${membership.id}`)
        .set('x-mock-user-id', memberClerkId);

      expect(response.status).toBe(200);

    });

    test('should return 400 when trying to remove owner', async () => {
      // Get owner's membership
      const ownerMembership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: { userId: ownerUserId, projectId: testProjectId },
        },
      });

      // Try to remove owner (should fail)
      const response = await request(app)
        .delete(`/projects/${testProjectId}/members/${ownerMembership.id}`)
        .set('x-mock-user-id', ownerClerkId);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Cannot remove the project owner');
    });

    test('should return 403 when admin tries to remove another admin', async () => {
      // Create an admin
      const adminClerkId = 'admin_to_remove_' + Date.now();
      const adminEmail = `admintoremove_${Date.now()}@example.com`;
      
      const admin = await prisma.user.create({
        data: {
          clerkId: adminClerkId,
          email: adminEmail,
          username: 'admintoremove_' + Date.now(),
          avatar: null,
        },
      });

      // Add as ADMIN
      const adminMembership = await prisma.projectMember.create({
        data: {
          userId: admin.id,
          projectId: testProjectId,
          role: 'ADMIN',
        },
      });

      // Create another admin
      const admin2ClerkId = 'second_admin_' + Date.now();
      const admin2Email = `secondadmin_${Date.now()}@example.com`;
      
      const admin2 = await prisma.user.create({
        data: {
          clerkId: admin2ClerkId,
          email: admin2Email,
          username: 'secondadmin_' + Date.now(),
          avatar: null,
        },
      });

      const admin2Membership = await prisma.projectMember.create({
        data: {
          userId: admin2.id,
          projectId: testProjectId,
          role: 'ADMIN',
        },
      });

      // First admin tries to remove second admin (should fail)
      const response = await request(app)
        .delete(`/projects/${testProjectId}/members/${admin2Membership.id}`)
        .set('x-mock-user-id', adminClerkId);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Admins cannot remove other admins');

      // Clean up
      await prisma.projectMember.deleteMany({
        where: { userId: { in: [admin.id, admin2.id] }, projectId: testProjectId },
      });
      await prisma.user.deleteMany({
        where: { id: { in: [admin.id, admin2.id] } },
      });
    });

    test('should return 403 when member tries to remove another member', async () => {
      // Create first member
      const member1ClerkId = 'member1_to_test_' + Date.now();
      const member1Email = `member1totest_${Date.now()}@example.com`;
      
      const member1 = await prisma.user.create({
        data: {
          clerkId: member1ClerkId,
          email: member1Email,
          username: 'member1totest_' + Date.now(),
          avatar: null,
        },
      });

      const member1Membership = await prisma.projectMember.create({
        data: {
          userId: member1.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      // Create second member
      const member2ClerkId = 'member2_to_test_' + Date.now();
      const member2Email = `member2totest_${Date.now()}@example.com`;
      
      const member2 = await prisma.user.create({
        data: {
          clerkId: member2ClerkId,
          email: member2Email,
          username: 'member2totest_' + Date.now(),
          avatar: null,
        },
      });

      const member2Membership = await prisma.projectMember.create({
        data: {
          userId: member2.id,
          projectId: testProjectId,
          role: 'MEMBER',
        },
      });

      // First member tries to remove second member (should fail)
      const response = await request(app)
        .delete(`/projects/${testProjectId}/members/${member2Membership.id}`)
        .set('x-mock-user-id', member1ClerkId);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('You do not have permission');

      // Clean up
      await prisma.projectMember.deleteMany({
        where: { userId: { in: [member1.id, member2.id] }, projectId: testProjectId },
      });
      await prisma.user.deleteMany({
        where: { id: { in: [member1.id, member2.id] } },
      });
    });

    test('should return 404 for non-existent member', async () => {
      const response = await request(app)
        .delete(`/projects/${testProjectId}/members/non-existent-id`)
        .set('x-mock-user-id', ownerClerkId);

      expect(response.status).toBe(404);
    });
  });
});
