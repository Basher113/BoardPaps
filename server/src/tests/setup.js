const prisma = require("../lib/prisma");

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.refreshToken.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});