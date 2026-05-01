# Full-Stack Team Task Manager

A modern, collaborative team task management application built with a monorepo architecture using Turborepo. This application features role-based access control (Admin/User), project management, Kanban-style task tracking, and team member management.

## 🚀 Tech Stack

### Frontend (`apps/frontend`)
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Authentication:** JWT with HttpOnly cookies (Silent Refresh)

### Backend (`apps/server`)
- **Runtime:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database Access:** Shared database package
- **Security:** Helmet, CORS, Cookie Parser, bcrypt for password hashing

### Database (`packages/database`)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Schema:** Contains models for `User`, `Project`, `Task`, and `TeamMember` (Join table)

---

## 🛠️ Monorepo Structure

This project uses [Turborepo](https://turbo.build/repo) to manage multiple applications and packages in a single repository.

```text
.
├── apps
│   ├── frontend    # Next.js web application
│   └── server      # Express API server
└── packages
    ├── config-eslint   # Shared ESLint configurations
    ├── config-typescript # Shared TypeScript configurations
    └── database        # Prisma schema and generated client
```

---

## ✨ Key Features

- **Role-Based Access Control:** Distinct `ADMIN` and `USER` roles. Admins can create projects, manage teams, and assign tasks. Users can view their assigned projects, tasks, and update task statuses.
- **Dynamic Dashboard:** Personalized dashboard showing relevant metrics (total projects, tasks, and completion rates) based on the user's role.
- **Team Management:** Admins can easily add or remove users from projects.
- **Kanban Task Board:** Interactive three-column task board (Pending, In Progress, Completed) with inline status updates and assignee management.
- **Secure Authentication:** Stateless JWT architecture. Access tokens are stored in memory, while refresh tokens are securely stored in HttpOnly cookies to prevent XSS attacks.

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- npm or pnpm

### 1. Installation

Clone the repository and install dependencies from the root:
```sh
npm install
```

### 2. Environment Variables

Set up your `.env` files in the respective directories.

**Root / `packages/database/.env`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_manager?schema=public"
```

**`apps/server/.env`:**
```env
PORT=4000
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
```

**`apps/frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3. Database Setup

Navigate to the database package to push the schema and generate the client:
```sh
cd packages/database
npx prisma db push
npx prisma generate
```

*(Optional)* You can use Prisma Studio to manually create an initial `ADMIN` user to explore the application:
```sh
npx prisma studio
```

### 4. Running the Application

Start all applications and packages simultaneously from the root of the monorepo using Turbo:
```sh
npm run dev
```

- Frontend will be available at `http://localhost:3000`
- Backend API will be available at `http://localhost:4000`

---

## 🔧 Scripts

Useful commands that can be run from the root directory:

- `npm run dev`: Starts the development servers for all apps.
- `npm run build`: Builds all apps and packages.
- `npm run lint`: Lints all apps and packages.
- `npm run db:push`: Pushes the Prisma schema to the database (runs inside the database package).
- `npm run db:studio`: Opens Prisma Studio.
