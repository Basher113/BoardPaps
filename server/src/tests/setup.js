const prisma = require("../lib/prisma");

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.issue.deleteMany({});
  await prisma.column.deleteMany({});
  await prisma.board.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.refreshToken.deleteMany({})
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});