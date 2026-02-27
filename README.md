# DataPulse Monorepo

A full-stack analytics dashboard built with **Next.js**, **GraphQL**, **Express**, and **MongoDB**.

---

## 📁 Structure

```
datapulse/
├── apps/
│   ├── api/          # GraphQL API — Express + MongoDB + JWT
│   └── web/          # Frontend — Next.js + React + TypeScript (coming soon)
├── packages/
│   └── eslint-config/    # Shared ESLint config (coming soon)
├── package.json          # Root workspace config
└── pnpm-workspace.yaml
```

---

## 🛠 Tech Stack

### API (`apps/api`)
- **Runtime:** Node.js + TypeScript
- **Server:** Express 5
- **API:** Apollo Server + GraphQL
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Dev:** ts-node-dev

### Web (`apps/web`) — coming soon
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit + React Query
- **Charts:** Recharts

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 8+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/datapulse.git
cd datapulse

# Install all dependencies
pnpm install
```

### Environment Variables

Create `.env` in `apps/api/`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/datapulse
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## 📦 Commands

All commands are run from the **root** of the monorepo.

| Command | Description |
|---|---|
| `pnpm dev:api` | Start API in development mode |
| `pnpm build:api` | Build API for production |
| `pnpm lint` | Lint all packages |
| `pnpm lint:fix` | Auto-fix lint errors in all packages |
| `pnpm format` | Format all files with Prettier |

### Run individual packages

```bash
# Run a command only in api
pnpm --filter api dev

# Run a command only in web (when added)
pnpm --filter web dev
```

---

## 🐳 Docker

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📐 Code Quality

This monorepo uses **ESLint** + **Prettier** for consistent code style across all packages.

- TypeScript strict rules
- Import order enforced
- Prettier integrated into ESLint

```bash
pnpm lint        # check
pnpm lint:fix    # auto-fix
pnpm format      # format
```

---

## 📄 License

MIT