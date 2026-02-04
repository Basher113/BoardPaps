const prisma = require("../src/lib/prisma");
const bcrypt = require("bcryptjs");

const hashPassword = (password) => bcrypt.hashSync(password, 10);
async function main() {
  console.log("🌱 Seeding database...");

  
  await prisma.issue.deleteMany({});
  await prisma.column.deleteMany({});
  await prisma.board.deleteMany({});
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
  // BOARDS
  // -------------------
  
    const boardA1 =  await prisma.board.create({
      data: { name: "Development", projectId: projectA.id },
    })
    const boardA2 = await prisma.board.create({
      data: { name: "Backlog", projectId: projectA.id },
    })
    const boardB1 = await prisma.board.create({
      data: { name: "Sprint Board", projectId: projectB.id },
    })

  // -------------------
  // COLUMNS (helper)
  // -------------------
  async function createColumns(boardId) {
    const columns = []
    
    columns.push(await prisma.column.create({ data: { name: "To Do", position: 1, boardId } }))
    columns.push(await prisma.column.create({
      data: { name: "In Progress", position: 2, boardId },
    }))
    columns.push(await prisma.column.create({ data: { name: "Review", position: 3, boardId } }))
    columns.push(await prisma.column.create({ data: { name: "Done", position: 4, boardId } }))
  
    return columns;
  }

  const [a1Todo, a1Prog, a1Rev, a1Done] = await createColumns(boardA1.id);
  const [a2Todo, a2Prog, a2Rev, a2Done] = await createColumns(boardA2.id);
  const [b1Todo, b1Prog, b1Rev, b1Done] = await createColumns(boardB1.id);

  // -------------------
  // ISSUES (helper)
  // -------------------
  async function createIssue(data) {
    return prisma.issue.create({ data });
  }

  
    // Project A – Development board
    await createIssue({
      title: "Setup CI pipeline",
      description: "Add GitHub Actions",
      type: "TASK",
      priority: "MEDIUM",
      position: 1,
      boardId: boardA1.id,
      columnId: a1Todo.id,
      reporterId: alice.id,
      assigneeId: bob.id,
    })
    await createIssue({
      title: "Auth token bug",
      description: "Refresh token rotation broken",
      type: "BUG",
      priority: "CRITICAL",
      position: 2,
      boardId: boardA1.id,
      columnId: a1Todo.id,
      reporterId: bob.id,
      assigneeId: alice.id,
    })
    await createIssue({
      title: "Drag & drop columns",
      type: "STORY",
      priority: "HIGH",
      position: 1,
      boardId: boardA1.id,
      columnId: a1Prog.id,
      reporterId: carol.id,
      assigneeId: dave.id,
    })

    // Project A – Backlog
    await createIssue({
      title: "Dark mode",
      type: "EPIC",
      priority: "LOW",
      position: 1,
      boardId: boardA2.id,
      columnId: a2Todo.id,
      reporterId: alice.id,
    })

    // Project B – Sprint board
    await createIssue({
      title: "Push notifications",
      type: "STORY",
      priority: "HIGH",
      position: 1,
      boardId: boardB1.id,
      columnId: b1Prog.id,
      reporterId: carol.id,
      assigneeId: eve.id,
    })
    await createIssue({
      title: "App icon redesign",
      type: "TASK",
      priority: "MEDIUM",
      position: 1,
      boardId: boardB1.id,
      columnId: b1Done.id,
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
