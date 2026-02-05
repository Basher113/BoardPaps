const request = require('supertest');
const app = require('../app');
const {
  setupTest,
  teardownTest,
  createTestProject,
  createTestUsers,
  createDefaultColumns,
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
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.refreshToken.deleteMany();
  });

  // ==================== GET /projects/:projectId/issues ====================
  describe('GET /projects/:projectId/issues', () => {
    let project, testUsers, token, columns;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      columns = await createDefaultColumns(project.id);
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues`);
        
        expect(res.statusCode).toBe(401);
      });

      it('should return 401 when invalid access token is provided', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues`)
          .set('Cookie', 'accessToken=invalid-token');

        expect(res.statusCode).toBe(401);
      });
    });

    describe('Authorization', () => {
      it('should return 403 when user is not a project member', async () => {
        const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
        const res = await request(app)
          .get(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${nonMemberToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
      });

      it('should allow project member to access issues', async () => {
        const memberToken = generateAccessToken(testUsers.member.id);
        const res = await request(app)
          .get(`/projects/${project.id}/issues`)
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
              projectId: project.id,
              columnId: columns[0].id,
              reporterId: testUsers.owner.id,
              assigneeId: testUsers.member.id
            },
            {
              title: 'Task Issue',
              type: 'TASK',
              priority: 'MEDIUM',
              position: 1,
              projectId: project.id,
              columnId: columns[0].id,
              reporterId: testUsers.member.id,
              assigneeId: testUsers.owner.id
            },
            {
              title: 'Story Issue',
              type: 'STORY',
              priority: 'LOW',
              position: 2,
              projectId: project.id,
              columnId: columns[1].id,
              reporterId: testUsers.owner.id
            }
          ]
        });
      });

      it('should return all issues for the project', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(3);
      });

      it('should filter issues by columnId', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues?columnId=${columns[0].id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data.every(issue => issue.columnId === columns[0].id)).toBe(true);
      });

      it('should filter issues by type', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues?type=BUG`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].type).toBe('BUG');
      });

      it('should filter issues by priority', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues?priority=HIGH`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].priority).toBe('HIGH');
      });

      it('should filter issues by assigneeId', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues?assigneeId=${testUsers.member.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].assignee.id).toBe(testUsers.member.id);
      });

      it('should filter issues by reporterId', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues?reporterId=${testUsers.owner.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data.every(issue => issue.reporter.id === testUsers.owner.id)).toBe(true);
      });

      it('should combine multiple filters', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues?type=BUG&priority=HIGH`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].type).toBe('BUG');
        expect(res.body.data[0].priority).toBe('HIGH');
      });

      it('should return empty array when no issues match filters', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues?type=EPIC`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual([]);
      });

      it('should include reporter and assignee details', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data[0]).toHaveProperty('reporter');
        expect(res.body.data[0].reporter).toHaveProperty('id');
        expect(res.body.data[0].reporter).toHaveProperty('email');
        expect(res.body.data[0].reporter).toHaveProperty('username');
      });
    });
  });

  // ==================== GET /projects/:projectId/issues/:issueId ====================
  describe('GET /projects/:projectId/issues/:issueId', () => {
    let project, testUsers, token, columns, issue;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      columns = await createDefaultColumns(project.id);
      
      issue = await prisma.issue.create({
        data: {
          title: 'Test Issue',
          description: 'Test Description',
          type: 'TASK',
          priority: 'MEDIUM',
          position: 0,
          projectId: project.id,
          columnId: columns[0].id,
          reporterId: testUsers.owner.id
        }
      });
    });

    describe('Success Cases', () => {
      it('should return single issue with full details', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues/${issue.id}`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(issue.id);
        expect(res.body.data.title).toBe('Test Issue');
        expect(res.body.data).toHaveProperty('column');
        expect(res.body.data).toHaveProperty('reporter');
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when issue does not exist', async () => {
        const res = await request(app)
          .get(`/projects/${project.id}/issues/non-existent-id`)
          .set('Cookie', `accessToken=${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Issue not found');
      });
    });
  });

  // ==================== POST /projects/:projectId/issues ====================
  describe('POST /projects/:projectId/issues', () => {
    let project, testUsers, token, columns;

    beforeEach(async () => {
      await setupTest();
      testUsers = await createTestUsers();
      project = await createTestProject({
        ownerId: testUsers.owner.id,
        memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
      });
      token = generateAccessToken(testUsers.owner.id);
      columns = await createDefaultColumns(project.id);
    });

    describe('Authentication', () => {
      it('should return 401 when no access token is provided', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .send({
            title: 'New Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });
        
        expect(res.statusCode).toBe(401);
      });
    });

    describe('Validation', () => {
      it('should reject empty title', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: '',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Issue title is required');
      });

      it('should reject missing title', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject title longer than 200 characters', async () => {
        const longTitle = 'a'.repeat(201);
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: longTitle,
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject invalid issue type', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Test',
            type: 'INVALID_TYPE',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject invalid priority', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Test',
            type: 'TASK',
            priority: 'INVALID_PRIORITY',
            columnId: columns[0].id
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should reject missing columnId', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
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
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: '  Trimmed Title  ',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });
        expect(res.statusCode).toBe(201);
        expect(res.body.data.title).toBe('Trimmed Title');
      });
    });

    describe('Success Cases', () => {
      it('should create issue with minimum required fields', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'New Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('New Issue');
        expect(res.body.data.type).toBe('TASK');
        expect(res.body.data.priority).toBe('MEDIUM');
        expect(res.body.data.columnId).toBe(columns[0].id);
        expect(res.body.data.reporterId).toBe(testUsers.owner.id);
      });

      it('should create issue with all fields', async () => {
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Full Issue',
            description: 'Full description',
            type: 'BUG',
            priority: 'HIGH',
            columnId: columns[0].id,
            assigneeId: testUsers.member.id
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.data.description).toBe('Full description');
        expect(res.body.data.assigneeId).toBe(testUsers.member.id);
      });

      it('should create issue at the last position', async () => {
        // Create first issue
        await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'First Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });

        // Create second issue
        const res = await request(app)
          .post(`/projects/${project.id}/issues`)
          .set('Cookie', `accessToken=${token}`)
          .send({
            title: 'Second Issue',
            type: 'TASK',
            priority: 'MEDIUM',
            columnId: columns[0].id
          });

        expect(res.statusCode).toBe(201);

        // Verify positions
        const issues = await prisma.issue.findMany({
          where: { columnId: columns[0].id },
          orderBy: { position: 'asc' }
        });
        expect(issues).toHaveLength(2);
      });
    });
  });
});
