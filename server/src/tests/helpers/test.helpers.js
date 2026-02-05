const prisma = require("../../lib/prisma");

// Test user credentials
const testUsers = {
  owner: {
    email: 'owner@test.com',
    username: 'owner',
    password: '$2b$10$XqQ0YZJ9Z9Z9Z9Z9Z9Z9ZOqQ0YZJ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9' // hashed 'password123'
  },
  member: {
    email: 'member@test.com',
    username: 'member',
    password: '$2b$10$XqQ0YZJ9Z9Z9Z9Z9Z9Z9ZOqQ0YZJ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9'
  },
  nonMember: {
    email: 'nonMember@test.com',
    username: 'nonMember',
    password: '$2b$10$XqQ0YZJ9Z9Z9Z9Z9Z9Z9ZOqQ0YZJ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9'
  }
};

// Clean database before each test suite
const cleanDatabase = async () => {
  await prisma.issue.deleteMany({});
  await prisma.column.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.refreshToken.deleteMany();
};

// Create test users
const createTestUsers = async () => {
  await prisma.user.createMany({
    data: Object.values(testUsers),
    skipDuplicates: true // Prevent errors if users already exist
  });

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: [
          "owner@test.com",
          "member@test.com",
          "nonMember@test.com",
        ],
      },
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  const reformatTestUsers = users.reduce((accumulator, user) => {
    accumulator[user.username] = user;
    return accumulator;
  }, {});
  return reformatTestUsers;
};

// Create a test project with owner and members
const createTestProject = async (options = {}) => {
  const {
    ownerId,
    memberIdsAndRoles,
    name = 'Test Project',
    key = 'TEST'
  } = options;

  const project = await prisma.project.create({
    data: {
      name,
      key,
      ownerId,
      members: {
        create: [
          ...memberIdsAndRoles,
          {
            userId: ownerId,
            role: "OWNER"
          }
        ]
      }
    },
    include: {
      members: true
    }
  });

  return project;
};

// Create a test column (directly under project)
const createTestColumn = async (projectId, options = {}) => {
  const {
    name = 'Test Column',
    position = 0
  } = options;

  const column = await prisma.column.create({
    data: {
      name,
      position,
      projectId
    }
  });

  return column;
};

// Create default columns for a project
const createDefaultColumns = async (projectId) => {
  await prisma.column.createMany({
    data: [
      { name: 'To Do', position: 0, projectId },
      { name: 'In Progress', position: 1, projectId },
      { name: 'Done', position: 2, projectId }
    ]
  });
  
  return prisma.column.findMany({
    where: { projectId },
    orderBy: { position: 'asc' }
  });
};

// Create a test issue (columns are now directly under project)
const createTestIssue = async (projectId, columnId, reporterId, options = {}) => {
  const {
    title = 'Test Issue',
    description = 'Test Description',
    type = 'TASK',
    priority = 'MEDIUM',
    position = 0,
    assigneeId = null
  } = options;

  const issue = await prisma.issue.create({
    data: {
      title,
      description,
      type,
      priority,
      position,
      projectId,
      columnId,
      reporterId,
      assigneeId
    }
  });

  return issue;
};

// Create multiple test issues
const createTestIssues = async (projectId, columnId, reporterId, count = 3) => {
  const issues = [];
  for (let i = 0; i < count; i++) {
    const issue = await createTestIssue(projectId, columnId, reporterId, {
      title: `Test Issue ${i + 1}`,
      position: i,
      type: i % 2 === 0 ? 'TASK' : 'BUG',
      priority: ['LOW', 'MEDIUM', 'HIGH'][i % 3]
    });
    issues.push(issue);
  }
  return issues;
};

// Setup and teardown helpers
const setupTest = async () => {
  await cleanDatabase();
};

const teardownTest = async () => {
  await cleanDatabase();
  await prisma.$disconnect();
};

module.exports = {
  cleanDatabase,
  createTestUsers,
  createTestProject,
  createTestColumn,
  createDefaultColumns,
  createTestIssue,
  createTestIssues,
  setupTest,
  teardownTest
};
