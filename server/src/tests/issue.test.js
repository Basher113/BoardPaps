const request = require('supertest');
const app = require('../app');
const {
  setupTest,
  teardownTest,
  createTestProject,
  createTestUsers,
  createTestBoard,
} = require('./helpers/test.helpers');

const {generateAccessToken} = require("../utils/token.utils");
const prisma = require("../lib/prisma");


describe('Issue tests - Test Suite for /GET and /POST', () => {

  afterAll(async () => {
    await teardownTest();
  });

  afterEach(async () => {
    await prisma.issue.deleteMany();
    await prisma.column.deleteMany();
    await prisma.board.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.refreshToken.deleteMany();
  });

  // ==================== GET /projects/:projectId/boards/:boardId/issues ====================
  describe('GET /projects/:projectId/boards/:boardId/issues', () => {
    let project, testUsers, token, board, column;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      board = await createTestBoard(project.id);
      column = board.columns[0];
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues`);
        
        expect(res.statusCode).toBe(401);
      });

      it('should return 401 when invalid access token is provided', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', 'accessToken=invalid-token');

        expect(res.statusCode).toBe(401);
      });
    });

    describe('Authorization', () => {
      it('should return 403 when user is not a project member', async () => {
        const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${nonMemberToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
      });

      it('should allow project member to access issues', async () => {
        const memberToken = generateAccessToken(testUsers.member.id);
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${memberToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe('Success Cases - Filtering', () => {
      beforeEach(async () => {
        // Create test issues with different properties
        await prisma.issue.createMany({
          data: [
            {
              title: 'Bug Issue',
              type: 'BUG',
              priority: 'HIGH',
              position: 0,
              boardId: board.id,
              columnId: column.id,
              reporterId: testUsers.owner.id,
              assigneeId: testUsers.member.id
            },
            {
              title: 'Task Issue',
              type: 'TASK',
              priority: 'MEDIUM',
              position: 1,
              boardId: board.id,
              columnId: column.id,
              reporterId: testUsers.member.id,
              assigneeId: testUsers.owner.id
            },
            {
              title: 'Story Issue',
              type: 'STORY',
              priority: 'LOW',
              position: 2,
              boardId: board.id,
              columnId: board.columns[1].id,
              reporterId: testUsers.owner.id
            }
          ]
        });
      });

      it('should return all issues for the board', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(3);
      });

      it('should filter issues by columnId', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues?columnId=${column.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data.every(issue => issue.columnId === column.id)).toBe(true);
      });

      it('should filter issues by type', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues?type=BUG`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].type).toBe('BUG');
      });

      it('should filter issues by priority', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues?priority=HIGH`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].priority).toBe('HIGH');
      });

      it('should filter issues by assigneeId', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues?assigneeId=${testUsers.member.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].assignee.id).toBe(testUsers.member.id);
      });

      it('should filter issues by reporterId', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues?reporterId=${testUsers.owner.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data.every(issue => issue.reporter.id === testUsers.owner.id)).toBe(true);
      });

      it('should combine multiple filters', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues?type=BUG&priority=HIGH`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].type).toBe('BUG');
        expect(res.body.data[0].priority).toBe('HIGH');
      });

      it('should return empty array when no issues match filters', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues?type=EPIC`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual([]);
      });

      it('should include reporter and assignee details', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data[0]).toHaveProperty('reporter');
        expect(res.body.data[0].reporter).toHaveProperty('id');
        expect(res.body.data[0].reporter).toHaveProperty('email');
        expect(res.body.data[0].reporter).toHaveProperty('username');
      });
    });
  });

  // ==================== GET /projects/:projectId/boards/:boardId/issues/:issueId ====================
  describe('GET /projects/:projectId/boards/:boardId/issues/:issueId', () => {
    let project, testUsers, token, board, column, issue;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      board = await createTestBoard(project.id);
      column = board.columns[0];
      
      issue = await prisma.issue.create({
        data: {
          title: 'Test Issue',
          description: 'Test Description',
          type: 'TASK',
          priority: 'MEDIUM',
          position: 0,
          boardId: board.id,
          columnId: column.id,
          reporterId: testUsers.owner.id
        }
      });
    });

    describe('Success Cases', () => {
      it('should return single issue with full details', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(issue.id);
        expect(res.body.data.title).toBe('Test Issue');
        expect(res.body.data).toHaveProperty('board');
        expect(res.body.data).toHaveProperty('column');
        expect(res.body.data).toHaveProperty('reporter');
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when issue does not exist', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/boards/${board.id}/issues/non-existent-id`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Issue not found');
      });
    });
  });

  // ==================== POST /projects/:projectId/boards/:boardId/issues ====================
  describe('POST /projects/:projectId/boards/:boardId/issues', () => {
    let project, testUsers, token, board, column;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      board = await createTestBoard(project.id);
      column = board.columns[0];
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .send({
            title: 'New Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });
        
        expect(res.statusCode).toBe(401);
      });
    });

    describe('Validation', () => {
      it('should reject empty title', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: '',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Issue title is required');
      });

      it('should reject missing title', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject title longer than 200 characters', async () => {
        const longTitle = 'a'.repeat(201);
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: longTitle,
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject description longer than 5000 characters', async () => {
        const longDescription = 'a'.repeat(5001);
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Test',
            description: longDescription,
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject invalid issue type', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Test',
            type: 'INVALID_TYPE',
            priority: 'MEDIUM',
            columnId: column.id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject invalid priority', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Test',
            type: 'TASK',
            priority: 'INVALID_PRIORITY',
            columnId: column.id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject missing columnId', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Test',
            type: 'TASK',
            priority: 'MEDIUM'
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should trim whitespace from title', async () => {
    
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: '  Trimmed Title  ',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });
        expect(res.statusCode).toBe(201);
        expect(res.body.data.title).toBe('Trimmed Title');
      });
    });

    describe('Success Cases', () => {
      it('should create issue with minimum required fields', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'New Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('New Issue');
        expect(res.body.data.type).toBe('TASK');
        expect(res.body.data.priority).toBe('MEDIUM');
        expect(res.body.data.columnId).toBe(column.id);
        expect(res.body.data.reporterId).toBe(testUsers.owner.id);
      });

      it('should create issue with all fields', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Full Issue',
            description: 'Full description',
            type: 'BUG',
            priority: 'HIGH',
            columnId: column.id,
            assigneeId: testUsers.member.id
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.description).toBe('Full description');
        expect(res.body.data.assigneeId).toBe(testUsers.member.id);
      });

      it('should create issue at the last position', async () => {
        // Create first issue
        const lastPosition = 0;
        await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'First Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });

        // Create second issue at position 0
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Inserted Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id,
          });

        
        expect(res.statusCode).toBe(201);

        // Verify first issue was shifted
        const issues = await prisma.issue.findMany({
          where: { columnId: column.id },
          orderBy: { position: 'asc' }
        });

        expect(issues[1].title).toBe('Inserted Issue');
        expect(issues[1].position).toBe(1);

        expect(issues[0].title).toBe('First Issue');
      });

      it('should set reporter to current user', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'New Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.reporterId).toBe(testUsers.owner.id);
        expect(res.body.data.reporter.id).toBe(testUsers.owner.id);
      });

      it('should create issue with valid issue types', async () => {
        const types = ['TASK', 'BUG', 'STORY', 'EPIC'];
        
        for (const type of types) {
          const res = await request(app)
            .post(`/projects/${project.id}/boards/${board.id}/issues`)
            .set('Cookie', `accessToken=${token}`)
            .send({
              title: `${type} Issue`,
              type,
              priority: 'MEDIUM',
              columnId: column.id
            });

          expect(res.statusCode).toBe(201);
          expect(res.body.data.type).toBe(type);
        }
      });

      it('should create issue with valid priorities', async () => {
        const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        
        for (const priority of priorities) {
          const res = await request(app)
            .post(`/projects/${project.id}/boards/${board.id}/issues`)
            .set('Cookie', `accessToken=${token}`)
            .send({
              title: `${priority} Issue`,
              type: 'TASK',
              priority,
              columnId: column.id
            });

          expect(res.statusCode).toBe(201);
          expect(res.body.data.priority).toBe(priority);
        }
      });
    });

    describe('Error Cases', () => {
      it('should return 400 when columnId does not belong to board', async () => {
        const otherBoard = await createTestBoard(project.id, { name: 'Other Board' });
        
        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'New Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: otherBoard.columns[0].id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Invalid column for this board');
      });

      it('should return 400 when assignee is not a project member', async () => {

        const res = await request(app)
          .post(`/projects/${project.id}/boards/${board.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'New Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: column.id,
            assigneeId: testUsers.nonMember.id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Assignee must be a project member');
      });
    });
  });
});