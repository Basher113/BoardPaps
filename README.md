# BoardPaps

**A refreshingly simple Kanban board for teams who just want to get things done.**

## Why BoardPaps?

Most project management tools are overloaded with features you'll never use. Complex workflows, endless configurations, steep learning curves. BoardPaps takes a different approach.

**Our Philosophy:**

- **No bloat** — Only the features you actually need
- **No learning curve** — Intuitive interface from day one
- **No distractions** — Clean, minimal design
- **No compromises** — Fast, reliable, and stays out of your way

## Features

### Core Board
- **Kanban Board** — Drag and drop issues across columns
- **Issue Types** — Task, Bug, Story, Epic
- **Priority Levels** — Low, Medium, High, Critical
- **Issue Assignment** — Assign to team members
- **Issue Details** — Descriptions, due dates, and comments

### Project Management
- **Multiple Projects** — Separate boards for different initiatives
- **Custom Columns** — Match your workflow

### Team Collaboration
- **Email Invitations** — Invite teammates with personal messages
- **Role-Based Access** — Owner, Admin, and Member roles
- **Invitation Management** — Track, resend, or cancel invitations

### Dashboard & Overview
- **Personal Dashboard** — All your assigned issues at a glance
- **Cross-Project View** — Filter by project or status

### Security & Auditing
- **Audit Logs** — Track all project activity
- **Rate Limiting** — Protection against abuse

## Tech Stack

| Frontend | Backend | Services |
|----------|---------|----------|
| React 19 | Node.js | Clerk (Auth) |
| Vite 7 | Express 5 | Resend (Email) |
| Redux Toolkit | Prisma ORM | Cloudinary (Images) |
| Styled Components | PostgreSQL | |
| dnd-kit | Zod | |

## Acknowledgments

- [Clerk](https://clerk.com/) — Authentication
- [Prisma](https://www.prisma.io/) — Database ORM
- [Vite](https://vitejs.dev/) — Build tool
- [Lucide](https://lucide.dev/) — Icons
- [Resend](https://resend.com/) — Email delivery
- [Cloudinary](https://cloudinary.com/) — Image management
