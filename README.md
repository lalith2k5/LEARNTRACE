# LearnTrace: AI-Driven Knowledge Graph & Knowledge Tracing System

LearnTrace is an adaptive learning intelligence platform that combines Bayesian Knowledge Tracing (BKT), Deep Knowledge Tracing (DKT), and DAG-based prerequisite topological graphs to detect skill gaps, estimate mastery, and recommend high-leverage learning paths.

---

## 🏗️ Architecture

The repository is organized as a consolidated, full-stack TypeScript application:

```
├── server.ts                  # Root unified server (Express + Vite middleware in dev, static in prod)
├── src/                       # Frontend React 18 + Tailwind CSS application
│   ├── components/            # UI components (SkillGraphView, ResearchBenchmarkView, Quiz, etc.)
│   ├── pages/                 # Route views (DashboardPage, LoginPage, RegisterPage)
│   ├── context/               # AuthContext (JWT authentication state)
│   ├── api/                   # Typed API client
│   └── types.ts               # Core domain models & data contract definitions
├── server/                    # Backend services, persistent storage, and seed data
│   ├── db.ts                  # PostgreSQL connection, Prisma client, and auto-seeding
│   ├── store.ts               # Memory state store with JSON file backup and sync
│   ├── services/              # Domain services
│   │   ├── graphService.ts            # Prerequisite DAG traversal & topological sorting
│   │   ├── masteryService.ts          # Ebbinghaus decay & mastery computation
│   │   ├── recommendationService.ts   # High-leverage prerequisite gap recommendations
│   │   ├── learningPathService.ts     # Goal-oriented learning path generation
│   │   ├── knowledgeTracingService.ts # BKT & DKT research tracing models
│   │   ├── semanticGraderService.ts   # Open-ended cognitive evaluation
│   │   └── ollamaService.ts           # Gemini AI & local Ollama tutor integration
│   └── data/                  # Assessment items and curated learning resources
│       ├── questionBank.ts    # Comprehensive question bank (40+ psychometrically calibrated items)
│       └── learningResources.ts # Curated readings, guides, and exercises
├── prisma/                    # Relational database schema & migrations
│   ├── schema.prisma          # PostgreSQL relational schema (11 tables)
│   ├── seed.ts                # TypeScript database seed script
│   └── migrations/            # Production migration bundle
└── scripts/                   # Verification and testing automation
    ├── verify_prisma_deployment.ts  # Database connection & migration readiness verification
    └── e2e_learner_scenario.ts      # Automated end-to-end learner acceptance workflow
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Starts the unified server on `http://localhost:3000` with hot Vite frontend integration and Express API routes.

### 3. Production Build & Start
```bash
npm run build
npm run start
```
Bundles the frontend into `dist/` and compiles the backend into `dist/server.cjs` via `esbuild`.

---

## 🗄️ Database & Persistence

LearnTrace provides dual-layer resilience:

1. **PostgreSQL (via Prisma)**: When `DATABASE_URL` is set, the application automatically connects, verifies schema, runs migrations via `npm run prisma:migrate`, and synchronizes user data and attempts.
2. **Local Fallback Mode**: If PostgreSQL is temporarily unreachable in development, the platform automatically falls back to local persistent storage (`data/learntrace_store.json`), preventing downtime and enabling local sandboxed testing.

### Useful Database Scripts
- `npm run seed`: Seeds the database with all curriculum skills, prerequisite edges, learning goals, questions, and resources.
- `npm run verify:db`: Verifies Prisma schema, migration bundle, and connection status.
- `npm run prisma:migrate`: Deploys migrations to the active database.
- `npm run prisma:generate`: Re-generates the Prisma Client.

---

## 🔬 Research & Model Evaluation Laboratory

LearnTrace includes a built-in interactive Model Evaluation Laboratory:
- **Algorithms**: Bayesian Knowledge Tracing (BKT with $P(L_0), P(T), P(S), P(G)$ parameters) vs. Deep Knowledge Tracing (DKT recurrent decay) vs. LearnTrace Multimodal Cognitive Metric.
- **Access**: Available directly via the **Research** tab in the main navigation and the Research card on the Learner Dashboard.
- **Endpoints**: `/api/research/benchmark-simulation` and `/api/research/evaluate-models`.

---

## 🧪 Automated Verification

Run the end-to-end learner acceptance scenario:
```bash
npm run test:e2e
```
Validates:
1. Learner registration and authentication.
2. Learning goal selection.
3. Diagnostic assessment quiz and deliberate failure detection.
4. Downstream prerequisite blockage detection and DAG recommendation.
5. Resource retrieval and study.
6. Retake quiz and verified BKT/mastery score convergence.
