const app = require("../app");
const request = require("supertest");

const { 
  teardownTest,
  setupTest,
  createTestUsers,
  createTestProject,
  createDefaultColumns,
} = require("./helpers/test.helpers");
const { generateAccessToken } = require("../utils/token.utils");

describe("Column - Test Suite", () => {
  afterAll(async () => {
    await teardownTest();
  });

  describe("GET /projects/:projectId/columns", () => {
    let project, testUsers, columns;

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

    it("should allow members to see project columns", async () => {
      const memberToken = generateAccessToken(testUsers.member.id);
      const response = await request(app).get(`/projects/${project.id}/columns`)
                            .set('Cookie', `accessToken=${memberToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(3)
    });

    it("should not allow non-members to see the project columns", async () => {
      const nonMemberToken = generateAccessToken(testUsers.nonMember.id);
      const response = await request(app).get(`/projects/${project.id}/columns`)
                            .set('Cookie', `accessToken=${nonMemberToken}`);

      console.log(response.body);
      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Forbidden");
    })
  })
})
