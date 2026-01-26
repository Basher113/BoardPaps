const prisma = require("../src/lib/prisma");
const bcrypt = require("bcryptjs");

async function main() {
  console.log('Seeding database...');

  // DELETION
  // try {
  //   await prisma.issue.deleteMany({});
  //   await prisma.column.deleteMany({});
  //   await prisma.board.deleteMany({});
  //   await prisma.projectMember.deleteMany({});
  //   await prisma.project.deleteMany({});
  //   await prisma.user.deleteMany({});

  //   console.log("Deleted successfully");
  // } catch (error) {
  //   console.error("Delete unsuccessful :", error.message);
  // }
  
  

  // ===== 1️⃣ Create Users =====
  const hashedPassword1 = await bcrypt.hash("12345678", 10);
  const hashedPassword2 = await bcrypt.hash("12345678", 10);
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      username: 'alice',
      password: hashedPassword1, // Replace with hashed password in production
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      username: 'bob',
      password: hashedPassword2,
    },
  });

  // ===== 2️⃣ Create Project =====
  const project = await prisma.project.create({
    data: {
      name: 'Kanban Project',
      key: 'KANBAN',
      ownerId: alice.id,
    },
  });

  // ===== 3️⃣ Add Project Members =====
  await prisma.projectMember.createMany({
    data: [
      { userId: alice.id, projectId: project.id, role: 'OWNER' },
      { userId: bob.id, projectId: project.id, role: 'MEMBER' },
    ],
  });

  // ===== 4️⃣ Create Board =====
  const board = await prisma.board.create({
    data: {
      name: 'Development Board',
      projectId: project.id,
    },
  });

  // ===== 5️⃣ Create Columns =====
  const todo = await prisma.column.create({
    data: { name: 'Todo', position: 0, boardId: board.id },
  });

  const inProgress = await prisma.column.create({
    data: { name: 'In Progress', position: 1, boardId: board.id },
  });

  const done = await prisma.column.create({
    data: { name: 'Done', position: 2, boardId: board.id },
  });

  // ===== 6️⃣ Create Sample Issues =====
  await prisma.issue.createMany({
    data: [
      {
        title: 'Setup project structure',
        description: 'Initialize React + Express + Prisma project',
        type: 'TASK',
        priority: 'HIGH',
        position: 0,
        boardId: board.id,
        columnId: todo.id,
        reporterId: alice.id,
        assigneeId: bob.id,
      },
      {
        title: 'Design Kanban Board UI',
        description: 'Create basic React components for columns and cards',
        type: 'STORY',
        priority: 'MEDIUM',
        position: 1,
        boardId: board.id,
        columnId: todo.id,
        reporterId: alice.id,
        assigneeId: alice.id,
      },
      {
        title: 'Implement drag and drop',
        description: 'Use dnd-kit to allow moving tasks between columns',
        type: 'TASK',
        priority: 'HIGH',
        position: 0,
        boardId: board.id,
        columnId: inProgress.id,
        reporterId: bob.id,
        assigneeId: alice.id,
      },
      {
        title: 'Fix login bug',
        description: 'Resolve issue where JWT token was not being stored',
        type: 'BUG',
        priority: 'CRITICAL',
        position: 0,
        boardId: board.id,
        columnId: done.id,
        reporterId: bob.id,
        assigneeId: bob.id,
      },
    ],
  });

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });