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

describe('Board Complete Test Suite', () => {

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

  // ==================== GET /projects/:projectId/boards ====================
  describe('GET /projects/:projectId/boards', () => {
    let project, testUsers, token;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
    });

    describe('Authentication', () => {
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
    });

    describe('Authorization', () => {
      it('should return 403 when user is not a project member', async () => {
        const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
        const res = await request(app)
          .get(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${nonMemberToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Forbidden');
      });

      it('should allow project member to access boards', async () => {
        const memberToken = generateAccessToken(testUsers.member.id);
        const res = await request(app)
          .get(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${memberToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe('Success Cases', () => {
      it('should return empty array when no boards exist', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual([]);
      });

      it('should return all boards with columns and issue counts', async () => {
        await createTestBoard(project.id, { name: 'Board 1' });
        await createTestBoard(project.id, { name: 'Board 2' });

        const res = await request(app)
          .get(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data[0]).toHaveProperty('columns');
        expect(res.body.data[0]).toHaveProperty('_count');
      });
    });
  });

  // ==================== GET /projects/:projectId/boards/:boardId ====================
  describe('GET /projects/:projectId/boards/:boardId', () => {
    let project, testUsers, token, board;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      board = await createTestBoard(project.id, { name: 'Test Board' });
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}`);
        
        expect(res.statusCode).toBe(401);
      });

      it('should return 401 when invalid access token is provided', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', 'accessToken=invalid-token');

        expect(res.statusCode).toBe(401);
      });
    });

    describe('Authorization', () => {
      it('should return 403 when user is not a project member', async () => {
        const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${nonMemberToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
      });

      it('should allow project member to access board', async () => {
        const memberToken = generateAccessToken(testUsers.member.id);
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${memberToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe('Success Cases', () => {
      it('should return single board with full details', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(board.id);
        expect(res.body.data.name).toBe('Test Board');
        expect(res.body.data).toHaveProperty('project');
        expect(res.body.data).toHaveProperty('columns');
      });

      it('should include columns with issues', async () => {
        const column = board.columns[0];
        await prisma.issue.create({
          data: {
            title: 'Test Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 0,
            boardId: board.id,
            columnId: column.id,
            reporterId: testUsers.owner.id
          }
        });

        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.columns[0].issues).toHaveLength(1);
        expect(res.body.data.columns[0].issues[0].title).toBe('Test Issue');
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when board does not exist', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/non-existent-board-id`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board not found');
      });
    });
  });

  // ==================== POST /projects/:projectId/boards ====================
  describe('POST /projects/:projectId/boards', () => {
    let project, testUsers, token;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .send({ name: 'New Board' });
        
        expect(res.statusCode).toBe(401);
      });

      it('should return 401 when invalid access token is provided', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', 'accessToken=invalid-token')
          .send({ name: 'New Board' });

        expect(res.statusCode).toBe(401);
      });
    });

    describe('Authorization', () => {
      it('should return 403 when user is not a project member', async () => {
        const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${nonMemberToken}`)
          .send({ name: 'New Board' });

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
      });

      it('should allow project member to create board', async () => {
        const memberToken = generateAccessToken(testUsers.member.id);
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${memberToken}`)
          .send({ name: 'Member Board' });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
      });
    });

    describe('Validation', () => {
      it('should reject empty board name', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: '' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board name is required');
      });

      it('should reject missing board name', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`)
          .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board name is required');
      });

      it('should reject board name longer than 100 characters', async () => {
        const longName = 'a'.repeat(101);
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: longName });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board name must be 100 characters or less');
      });

      it('should trim whitespace from board name', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: '  Trimmed Board  ' });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.name).toBe('Trimmed Board');
      });
    });

    describe('Success Cases', () => {
      it('should create board with default columns', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: 'New Board' });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('New Board');
        expect(res.body.data.projectId).toBe(project.id);
        expect(res.body.data.columns).toHaveLength(3);
        expect(res.body.data.columns[0].name).toBe('To Do');
        expect(res.body.data.columns[1].name).toBe('In Progress');
        expect(res.body.data.columns[2].name).toBe('Done');
      });

      it('should create multiple boards for same project', async () => {
        await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: 'Board 1' });

        await request(app)
          .post(`/projects/${project.id}/boards`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: 'Board 2' });

        const boards = await prisma.board.findMany({
          where: { projectId: project.id }
        });

        expect(boards).toHaveLength(2);
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when project does not exist', async () => {
        const res = await request(app)
          .post('/projects/non-existent-project-id/boards')
          .set('Cookie', `accessToken=${token}`)
          .send({ name: 'New Board' });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });
  });

  // ==================== PUT /projects/:projectId/boards/:boardId ====================
  describe('PUT /projects/:projectId/boards/:boardId', () => {
    let project, testUsers, token, board;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      board = await createTestBoard(project.id, { name: 'Original Board' });
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .send({ name: 'Updated Board' });
        
        expect(res.statusCode).toBe(401);
      });

      it('should return 401 when invalid access token is provided', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', 'accessToken=invalid-token')
          .send({ name: 'Updated Board' });

        expect(res.statusCode).toBe(401);
      });
    });

    describe('Authorization', () => {
      it('should return 403 when user is not a project member', async () => {
        const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${nonMemberToken}`)
          .send({ name: 'Updated Board' });

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
      });

      it('should allow project member to update board', async () => {
        const memberToken = generateAccessToken(testUsers.member.id);
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${memberToken}`)
          .send({ name: 'Member Update' });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe('Validation', () => {
      it('should reject empty board name', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: '' });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board name is required');
      });

      it('should reject missing board name', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`)
          .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board name is required');
      });

      it('should reject board name longer than 100 characters', async () => {
        const longName = 'a'.repeat(101);
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: longName });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board name must be 100 characters or less');
      });

      it('should trim whitespace from board name', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: '  Trimmed Update  ' });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.name).toBe('Trimmed Update');
      });
    });

    describe('Success Cases', () => {
      it('should update board name', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: 'Updated Board' });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Updated Board');
        expect(res.body.data.id).toBe(board.id);
      });

      it('should preserve board columns after update', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: 'Updated Board' });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.columns).toHaveLength(3);
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when board does not exist', async () => {
        const res = await request(app)
          .put(`/projects/${project.id}/boards/non-existent-board-id`)
          .set('Cookie', `accessToken=${token}`)
          .send({ name: 'Updated Board' });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board not found');
      });
    });
  });

  // ==================== DELETE /projects/:projectId/boards/:boardId ====================
  describe('DELETE /projects/:projectId/boards/:boardId', () => {
    let project, testUsers, ownerToken, memberToken, board;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      ownerToken = generateAccessToken(testUsers.owner.id);
      memberToken = generateAccessToken(testUsers.member.id);
      board = await createTestBoard(project.id, { name: 'Board to Delete' });
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`);
        
        expect(res.statusCode).toBe(401);
      });

      it('should return 401 when invalid access token is provided', async () => {
        const res = await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', 'accessToken=invalid-token');

        expect(res.statusCode).toBe(401);
      });
    });

    describe('Authorization', () => {
      it('should return 403 when user is not a project member', async () => {
        const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
        const res = await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${nonMemberToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
      });

      it('should return 403 when user is member but not owner', async () => {
        const res = await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${memberToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Forbidden');
      });

      it('should allow project owner to delete board', async () => {
        const res = await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${ownerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe('Success Cases', () => {
      it('should delete board and return success message', async () => {
        const res = await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${ownerToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Board deleted successfully');

        // Verify board is deleted
        const deletedBoard = await prisma.board.findUnique({
          where: { id: board.id }
        });
        expect(deletedBoard).toBeNull();
      });

      it('should cascade delete columns when board is deleted', async () => {
        const columnsBefore = await prisma.column.findMany({
          where: { boardId: board.id }
        });
        expect(columnsBefore).toHaveLength(3);

        await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${ownerToken}`);

        const columnsAfter = await prisma.column.findMany({
          where: { boardId: board.id }
        });
        expect(columnsAfter).toHaveLength(0);
      });

      it('should cascade delete issues when board is deleted', async () => {
        const column = board.columns[0];
        await prisma.issue.create({
          data: {
            title: 'Test Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 0,
            boardId: board.id,
            columnId: column.id,
            reporterId: testUsers.owner.id
          }
        });

        await request(app)
          .delete(`/projects/${project.id}/boards/${board.id}`)
          .set('Cookie', `accessToken=${ownerToken}`);

        const issuesAfter = await prisma.issue.findMany({
          where: { boardId: board.id }
        });
        expect(issuesAfter).toHaveLength(0);
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when board does not exist', async () => {
        const res = await request(app)
          .delete(`/projects/${project.id}/boards/non-existent-board-id`)
          .set('Cookie', `accessToken=${ownerToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Board not found');
      });
    });
  });
});