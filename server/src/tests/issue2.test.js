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

describe("Issue tests - Test Suite for /GET and /POST", () => {
  // ==================== PUT /projects/:projectId/boards/:boardId/issues/:issueId ====================
  describe('PUT /projects/:projectId/boards/:boardId/issues/:issueId', () => {
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
        title: 'Original Title',
        description: 'Original Description',
        type: 'TASK',
        priority: 'MEDIUM',
        position: 0,
        boardId: board.id,
        columnId: column.id,
        reporterId: testUsers.owner.id
      }
    });
  });

  describe('Validation', () => {
    it('should reject empty title', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ title: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject title longer than 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ title: longTitle });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid type', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ type: 'INVALID' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid priority', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ priority: 'INVALID' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Success Cases', () => {
    it('should update issue title', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.description).toBe('Original Description'); // Unchanged
    });

    it('should update issue description', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ description: 'Updated Description' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.description).toBe('Updated Description');
    });

    it('should update issue type', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ type: 'BUG' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.type).toBe('BUG');
    });

    it('should update issue priority', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ priority: 'HIGH' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.priority).toBe('HIGH');
    });

    it('should update multiple fields at once', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({
          title: 'New Title',
          description: 'New Description',
          type: 'BUG',
          priority: 'CRITICAL'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('New Title');
      expect(res.body.data.description).toBe('New Description');
      expect(res.body.data.type).toBe('BUG');
      expect(res.body.data.priority).toBe('CRITICAL');
    });

    it('should assign issue to project member', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ assigneeId: testUsers.member.id });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.assigneeId).toBe(testUsers.member.id);
      expect(res.body.data.assignee.id).toBe(testUsers.member.id);
    });

    it('should unassign issue by setting assigneeId to null', async () => {
      // First assign
      await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ assigneeId: testUsers.member.id });

      // Then unassign
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ assigneeId: null });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.assigneeId).toBeNull();
    });

    it('should clear description by setting it to null', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ description: null });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.description).toBeNull();
    });
  });

  describe('Error Cases', () => {
    it('should return 404 when issue does not exist', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/non-existent-id`)
        .set('Cookie', `accessToken=${token}`)
        .send({ title: 'Updated' });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when assignee is not a project member', async () => {
      const res = await request(app)
        .put(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ assigneeId: testUsers.nonMember.id });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Assignee must be a project member');
    });
  });
  });

  // ==================== PATCH /projects/:projectId/boards/:boardId/issues/:issueId/move ====================
  describe('PATCH /projects/:projectId/boards/:boardId/issues/:issueId/move', () => {
  let project, testUsers, token, board, column1, column2, issue;

  beforeEach(async () => {
    await setupTest();
    testUsers = await createTestUsers();
    project = await createTestProject({
      ownerId: testUsers.owner.id,
      memberIdsAndRoles: [{ userId: testUsers.member.id, role: 'MEMBER' }]
    });
    token = generateAccessToken(testUsers.owner.id);
    board = await createTestBoard(project.id);
    column1 = board.columns[0]; // "To Do"
    column2 = board.columns[1]; // "In Progress"
    
    issue = await prisma.issue.create({
      data: {
        title: 'Test Issue',
        type: 'TASK',
        priority: 'MEDIUM',
        position: 0,
        boardId: board.id,
        columnId: column1.id,
        reporterId: testUsers.owner.id
      }
    });
  });

  describe('Validation', () => {
    it('should reject missing columnId', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ newPosition: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing newPosition', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject negative position', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id, newPosition: -1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-integer position', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id, newPosition: 1.5 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Success Cases - Move Between Columns', () => {
    it('should move issue to different column', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id, newPosition: 0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.columnId).toBe(column2.id);
      expect(res.body.data.position).toBe(0);
    });

    it('should adjust positions in source column after moving', async () => {
      // Create two more issues in column1
      await prisma.issue.createMany({
        data: [
          {
            title: 'Issue 2',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 1,
            boardId: board.id,
            columnId: column1.id,
            reporterId: testUsers.owner.id
          },
          {
            title: 'Issue 3',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 2,
            boardId: board.id,
            columnId: column1.id,
            reporterId: testUsers.owner.id
          }
        ]
      });

      // Move first issue to another column
      await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id, newPosition: 0 });

      // Check remaining issues in column1
      const remainingIssues = await prisma.issue.findMany({
        where: { columnId: column1.id },
        orderBy: { position: 'asc' }
      });

      expect(remainingIssues).toHaveLength(2);
      expect(remainingIssues[0].position).toBe(0);
      expect(remainingIssues[1].position).toBe(1);
    });

    it('should adjust positions in destination column', async () => {
      // Create an issue in column2
      await prisma.issue.create({
        data: {
          title: 'Existing Issue',
          type: 'TASK',
          priority: 'MEDIUM',
          position: 0,
          boardId: board.id,
          columnId: column2.id,
          reporterId: testUsers.owner.id
        }
      });

      // Move issue to column2 at position 0
      await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id, newPosition: 0 });

      const issuesInColumn2 = await prisma.issue.findMany({
        where: { columnId: column2.id },
        orderBy: { position: 'asc' }
      });

      expect(issuesInColumn2).toHaveLength(2);
      expect(issuesInColumn2[0].title).toBe('Test Issue');
      expect(issuesInColumn2[0].position).toBe(0);
      expect(issuesInColumn2[1].title).toBe('Existing Issue');
      expect(issuesInColumn2[1].position).toBe(1);
    });
  });

  describe('Success Cases - Reorder Within Same Column', () => {
    beforeEach(async () => {
      // Create additional issues in column1
      await prisma.issue.createMany({
        data: [
          {
            title: 'Issue 2',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 1,
            boardId: board.id,
            columnId: column1.id,
            reporterId: testUsers.owner.id
          },
          {
            title: 'Issue 3',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 2,
            boardId: board.id,
            columnId: column1.id,
            reporterId: testUsers.owner.id
          }
        ]
      });
    });

    it('should move issue down within same column', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column1.id, newPosition: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.position).toBe(2);

      const issues = await prisma.issue.findMany({
        where: { columnId: column1.id },
        orderBy: { position: 'asc' }
      });

      expect(issues[0].title).toBe('Issue 2');
      expect(issues[0].position).toBe(0);
      expect(issues[1].title).toBe('Issue 3');
      expect(issues[1].position).toBe(1);
      expect(issues[2].title).toBe('Test Issue');
      expect(issues[2].position).toBe(2);
    });

    it('should move issue up within same column', async () => {
      const lastIssue = await prisma.issue.findFirst({
        where: { title: 'Issue 3' }
      });

      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${lastIssue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column1.id, newPosition: 0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.position).toBe(0);

      const issues = await prisma.issue.findMany({
        where: { columnId: column1.id },
        orderBy: { position: 'asc' }
      });

      expect(issues[0].title).toBe('Issue 3');
      expect(issues[1].title).toBe('Test Issue');
      expect(issues[2].title).toBe('Issue 2');
    });

    it('should return early when position does not change', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column1.id, newPosition: 0 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.position).toBe(0);
    });
  });

  describe('Error Cases', () => {
    it('should return 404 when issue does not exist', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/non-existent-id/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id, newPosition: 0 });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when column does not belong to board', async () => {
      const otherBoard = await createTestBoard(project.id, { name: 'Other Board' });
      
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: otherBoard.columns[0].id, newPosition: 0 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid column for this board');
    });

    it('should return 400 when position exceeds maximum', async () => {
      const res = await request(app)
        .patch(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}/move`)
        .set('Cookie', `accessToken=${token}`)
        .send({ columnId: column2.id, newPosition: 100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
  });

  // ==================== DELETE /projects/:projectId/boards/:boardId/issues/:issueId ====================
  describe('DELETE /projects/:projectId/boards/:boardId/issues/:issueId', () => {
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
    it('should delete issue', async () => {
      const res = await request(app)
        .delete(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Issue deleted successfully');

      const deletedIssue = await prisma.issue.findUnique({
        where: { id: issue.id }
      });
      expect(deletedIssue).toBeNull();
    });

    it('should adjust positions after deletion', async () => {
      await prisma.issue.createMany({
        data: [
          {
            title: 'Issue 2',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 1,
            boardId: board.id,
            columnId: column.id,
            reporterId: testUsers.owner.id
          },
          {
            title: 'Issue 3',
            type: 'TASK',
            priority: 'MEDIUM',
            position: 2,
            boardId: board.id,
            columnId: column.id,
            reporterId: testUsers.owner.id
          }
        ]
      });

      await request(app)
        .delete(`/projects/${project.id}/boards/${board.id}/issues/${issue.id}`)
        .set('Cookie', `accessToken=${token}`);

      const remainingIssues = await prisma.issue.findMany({
        where: { columnId: column.id },
        orderBy: { position: 'asc' }
      });

      expect(remainingIssues).toHaveLength(2);
      expect(remainingIssues[0].position).toBe(0);
      expect(remainingIssues[1].position).toBe(1);
    });
  });

  describe('Error Cases', () => {
    it('should return 404 when issue does not exist', async () => {
      const res = await request(app)
        .delete(`/projects/${project.id}/boards/${board.id}/issues/non-existent-id`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
  });
})
