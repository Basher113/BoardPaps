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
  await prisma.board.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});
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

// const call = async () => {
//   await createTestUsers();
//   await cleanDatabase();
// }

// call()



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

// Create a test board
const createTestBoard = async (projectId, options = {}) => {
  const {
    name = 'Test Board',
    withColumns = true
  } = options;

  const boardData = {
    name,
    projectId
  };

  if (withColumns) {
    boardData.columns = {
      create: [
        { name: 'To Do', position: 0 },
        { name: 'In Progress', position: 1 },
        { name: 'Done', position: 2 }
      ]
    };
  }

  const board = await prisma.board.create({
    data: boardData,
    include: {
      columns: {
        orderBy: { position: 'asc' }
      }
    }
  });

  return board;
};

// Create a test column
const createTestColumn = async (boardId, options = {}) => {
  const {
    name = 'Test Column',
    position = 0
  } = options;

  const column = await prisma.column.create({
    data: {
      name,
      position,
      boardId
    }
  });

  return column;
};

// Create a test issue
const createTestIssue = async (boardId, columnId, reporterId, options = {}) => {
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
      boardId,
      columnId,
      reporterId,
      assigneeId
    }
  });

  return issue;
};

// Create multiple test issues
const createTestIssues = async (boardId, columnId, reporterId, count = 3) => {
  const issues = [];
  for (let i = 0; i < count; i++) {
    const issue = await createTestIssue(boardId, columnId, reporterId, {
      title: `Test Issue ${i + 1}`,
      position: i,
      type: i % 2 === 0 ? 'TASK' : 'BUG',
      priority: ['LOW', 'MEDIUM', 'HIGH'][i % 3]
    });
    issues.push(issue);
  }
  return issues;
};

// Mock authentication middleware for testing (for unit tests without full app)
const mockAuthMiddleware = (userId) => {
  return (req, res, next) => {
    req.user = { id: userId };
    next();
  };
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
  testUsers,
  cleanDatabase,
  createTestUsers,
  createTestProject,
  createTestBoard,
  createTestColumn,
  createTestIssue,
  createTestIssues,
  mockAuthMiddleware,
  setupTest,
  teardownTest
};