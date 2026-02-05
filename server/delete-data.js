const prisma = require("./src/lib/prisma");

async function main() {
  console.log("🗑️ Deleting all data...");

  await prisma.issue.deleteMany({});
  await prisma.column.deleteMany({});
  await prisma.board.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.refreshToken.deleteMany({})
  await prisma.user.deleteMany({});

  console.log("✅ All data deleted successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error deleting data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });