const prisma = require("../src/lib/prisma");
const bcrypt = require("bcryptjs");

const hashPassword = (password) => bcrypt.hashSync(password, 10);
async function main() {
  console.log("🌱 Seeding database...");

  
  await prisma.issue.deleteMany({});
  await prisma.column.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.refreshToken.deleteMany({})
  await prisma.user.deleteMany({});

  // -------------------
  // USERS
  // -------------------

  
  const alice = await prisma.user.create({
      data: {
        email: "alice@example.com",
        username: "alice",
        password: hashPassword("password"),
      },
    })

  const bob = await prisma.user.create({
      data: {
        email: "bob@example.com",
        username: "bob",
        password: hashPassword("password"),
      },
    })

  const carol = await prisma.user.create({
      data: {
        email: "carol@example.com",
        username: "carol",
        password: hashPassword("password"),
      },
    })

  const dave = await prisma.user.create({
      data: {
        email: "dave@example.com",
        username: "dave",
        password: hashPassword("password"),
      },
    })

  const eve = await prisma.user.create({
      data: {
        email: "eve@example.com",
        username: "eve",
        password: hashPassword("password"),
      },
    })

  
  // -------------------
  // PROJECTS
  // -------------------
  const projectA = await prisma.project.create({
    data: {
      name: "Issue Tracker",
      key: "ITRK",
      ownerId: alice.id,
    },
  });

  const projectB = await prisma.project.create({
    data: {
      name: "Mobile App",
      key: "MAPP",
      ownerId: carol.id,
    },
  });

  // -------------------
  // PROJECT MEMBERS
  // -------------------
  await prisma.projectMember.createMany({
    data: [
      // Project A
      { userId: alice.id, projectId: projectA.id, role: "OWNER" },
      { userId: bob.id, projectId: projectA.id, role: "ADMIN" },
      { userId: carol.id, projectId: projectA.id, role: "MEMBER" },
      { userId: dave.id, projectId: projectA.id, role: "MEMBER" },

      // Project B
      { userId: carol.id, projectId: projectB.id, role: "OWNER" },
      { userId: eve.id, projectId: projectB.id, role: "ADMIN" },
      { userId: alice.id, projectId: projectB.id, role: "MEMBER" },
    ],
  });

  // -------------------
  // COLUMNS (helper)
  // -------------------
  async function createColumns(projectId) {
    const columns = []
    
    columns.push(await prisma.column.create({ data: { name: "To Do", position: 1, projectId } }))
    columns.push(await prisma.column.create({
      data: { name: "In Progress", position: 2, projectId },
    }))
    columns.push(await prisma.column.create({ data: { name: "Review", position: 3, projectId } }))
    columns.push(await prisma.column.create({ data: { name: "Done", position: 4, projectId } }))
  
    return columns;
  }

  const [aTodo, aProg, aRev, aDone] = await createColumns(projectA.id);
  const [bTodo, bProg, bRev, bDone] = await createColumns(projectB.id);

  // -------------------
  // ISSUES (helper)
  // -------------------
  async function createIssue(data) {
    return prisma.issue.create({ data });
  }

  
    // Project A
    await createIssue({
      title: "Setup CI pipeline",
      description: "Add GitHub Actions",
      type: "TASK",
      priority: "MEDIUM",
      position: 1,
      projectId: projectA.id,
      columnId: aTodo.id,
      reporterId: alice.id,
      assigneeId: bob.id,
    })
    await createIssue({
      title: "Auth token bug",
      description: "Refresh token rotation broken",
      type: "BUG",
      priority: "CRITICAL",
      position: 2,
      projectId: projectA.id,
      columnId: aTodo.id,
      reporterId: bob.id,
      assigneeId: alice.id,
    })
    await createIssue({
      title: "Drag & drop columns",
      type: "STORY",
      priority: "HIGH",
      position: 1,
      projectId: projectA.id,
      columnId: aProg.id,
      reporterId: carol.id,
      assigneeId: dave.id,
    })

    // Project B
    await createIssue({
      title: "Push notifications",
      type: "STORY",
      priority: "HIGH",
      position: 1,
      projectId: projectB.id,
      columnId: bProg.id,
      reporterId: carol.id,
      assigneeId: eve.id,
    })
    await createIssue({
      title: "App icon redesign",
      type: "TASK",
      priority: "MEDIUM",
      position: 1,
      projectId: projectB.id,
      columnId: bDone.id,
      reporterId: eve.id,
      assigneeId: carol.id,
    })


  console.log("✅ Massive seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
