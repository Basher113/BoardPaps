const request = require('supertest');
const app = require('../app');
const {
  setupTest,
  teardownTest,
  createTestProject,
  createTestUsers,
  createTestBoard,
} = require('./helpers/test.helpers');

const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");

// Generate access token manually for testing
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, authConfig.access_secret, { expiresIn: '1h' });
};

describe('GET /projects/:projectId/boards', () => {

  afterAll(async () => {
    await teardownTest();
  });

  afterEach(async () => {
    await prisma.issue.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
  });

  describe('Authentication', () => {
    let project, testUsers;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
    });

    it('should return 401 when no access token is provided', async () => {
      const res = await request(app)
        .get(`/projects/${project.id}/boards`);
      
      expect(res.statusCode).toBe(401);
    });

    it('should return 401 when invalid access token is provided', async () => {
      const res = await request(app)
        .get(`/projects/${project.id}/boards`)
        .set('Cookie', 'accessToken=invalid-token');

      expect(res.statusCode).toBe(401);
    });

    it('should return 401 when expired token is provided', async () => {
      const expiredToken = jwt.sign(
        { userId: testUsers.owner.id },
        authConfig.access_secret,
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure token is expired
      await new Promise(resolve => setTimeout(resolve, 100));

      const res = await request(app)
        .get(`/projects/${project.id}/boards`)
        .set('Cookie', `accessToken=${expiredToken}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Authorization - Project Membership', () => {
    let project, testUsers;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
    });

    it('should return 403 when user is not a project member', async () => {
      const token = generateAccessToken(testUsers.nonMember.id);
      const res = await request(app)
        .get(`/projects/${project.id}/boards`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Forbidden');
    });

    it('should return 404 when project does not exist', async () => {
      const token = generateAccessToken(testUsers.owner.id);
      const res = await request(app)
        .get('/projects/non-existent-project-id/boards')
        .set('Cookie', `accessToken=${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Project not found or access denied');
    });

    it('should allow project owner to access boards', async () => {
      const token = generateAccessToken(testUsers.owner.id);
      const res = await request(app)
        .get(`/projects/${project.id}/boards`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should allow project member to access boards', async () => {
      const token = generateAccessToken(testUsers.member.id);
      const res = await request(app)
        .get(`/projects/${project.id}/boards`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});