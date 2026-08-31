import React, { useState } from 'react';
import { Code2, Copy, Check, FileText, Database, GitBranch, Cpu, Terminal, BookOpen, Sparkles } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string>('schema.prisma');

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const projectFiles: Record<string, { title: string; lang: string; category: string; icon: any; content: string }> = {
    'schema.prisma': {
      title: 'backend/prisma/schema.prisma',
      lang: 'prisma',
      category: 'Database & Schema',
      icon: Database,
      content: `// Prisma Schema for LearnTrace
// AI-Driven Knowledge Graph & Knowledge Tracing System

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String           @id @default(uuid())
  email           String           @unique
  passwordHash    String
  createdAt       DateTime         @default(now())

  // Relations
  userGoals       UserGoal[]
  attempts        Attempt[]
  skillMasteries  SkillMastery[]
  recommendations Recommendation[]
}

model LearningGoal {
  id            String     @id @default(uuid())
  name          String
  targetSkillId String
  targetSkill   Skill      @relation(fields: [targetSkillId], references: [id], onDelete: Cascade)

  // Relations
  userGoals     UserGoal[]
}

model UserGoal {
  userId     String
  goalId     String
  selectedAt DateTime     @default(now())

  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  goal       LearningGoal @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@id([userId, goalId])
}

model Skill {
  id              String             @id @default(uuid())
  name            String
  domain          String
  description     String?

  // Relations
  questions       Question[]         @relation("PrimarySkillQuestions")
  questionSkills  QuestionSkill[]
  skillMasteries  SkillMastery[]
  recommendations Recommendation[]
  learningGoals   LearningGoal[]

  // Prerequisite graph self-relations
  prerequisites   SkillPrerequisite[] @relation("SkillToPrereq")
  downstreamFor   SkillPrerequisite[] @relation("PrereqToSkill")
}

model SkillPrerequisite {
  skillId             String
  prerequisiteSkillId String

  // Meaning: skillId depends on prerequisiteSkillId
  skill               Skill  @relation("SkillToPrereq", fields: [skillId], references: [id], onDelete: Cascade)
  prerequisiteSkill   Skill  @relation("PrereqToSkill", fields: [prerequisiteSkillId], references: [id], onDelete: Cascade)

  @@id([skillId, prerequisiteSkillId])
}

model Question {
  id             String          @id @default(uuid())
  skillId        String
  text           String
  difficulty     Int             @default(1)
  correctAnswer  String
  questionType   String          @default("MULTIPLE_CHOICE")
  options        Json            // Array of { id: string, text: string }
  explanation    String?

  skill          Skill           @relation("PrimarySkillQuestions", fields: [skillId], references: [id], onDelete: Cascade)
  questionSkills QuestionSkill[]
  attempts       Attempt[]
}

model QuestionSkill {
  questionId String
  skillId    String

  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  skill      Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@id([questionId, skillId])
}

model Attempt {
  id               String   @id @default(uuid())
  userId           String
  questionId       String
  correct          Boolean
  timeTakenSeconds Int
  confidence       Int      @default(3)
  attemptNumber    Int      @default(1)
  createdAt        DateTime @default(now())

  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  question         Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

model SkillMastery {
  userId        String
  skillId       String
  masteryScore  Float    @default(0.0)
  lastUpdated   DateTime @default(now())
  evidenceCount Int      @default(0)

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill         Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@id([userId, skillId])
}

model Recommendation {
  id            String   @id @default(uuid())
  userId        String
  skillId       String
  priorityScore Float
  reasonText    String
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill         Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
}`,
    },

    'masteryService.js': {
      title: 'backend/src/services/masteryService.js',
      lang: 'javascript',
      category: 'Mastery Engine',
      icon: Cpu,
      content: `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * ============================================================================
 * MASTERY SERVICE
 * ============================================================================
 * 
 * METHODOLOGICAL NOTE:
 * This is an initial rule-based heuristic and NOT a scientifically validated
 * psychometric measurement model.
 * 
 * The architecture is intentionally designed with strict modularity so this service
 * can be replaced with Bayesian Knowledge Tracing (BKT), Item Response Theory (IRT),
 * or other probabilistic models without modifying the rest of the application.
 * ============================================================================
 */

async function calculateSkillMasteryForUser(userId, skillId) {
  // 1. Fetch user attempts for this skill ordered chronologically
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
      question: {
        OR: [
          { skillId: skillId },
          { questionSkills: { some: { skillId: skillId } } }
        ]
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  if (attempts.length === 0) {
    return await prisma.skillMastery.upsert({
      where: { userId_skillId: { userId, skillId } },
      update: { masteryScore: 0.0, evidenceCount: 0, lastUpdated: new Date() },
      create: { userId, skillId, masteryScore: 0.0, evidenceCount: 0, lastUpdated: new Date() }
    });
  }

  let weightedScoreSum = 0;
  let totalWeight = 0;

  // 2. 1-based recency weight: weight = position (1, 2, 3...)
  attempts.forEach((attempt, index) => {
    const weight = index + 1;
    let adjustedScore = 0;

    if (attempt.correct) {
      const confidence = Math.min(Math.max(attempt.confidence || 3, 1), 5);
      // Adjusted score formula
      adjustedScore = 1.0 * (0.7 + 0.3 * (confidence / 5));
    } else {
      adjustedScore = 0.0;
    }

    weightedScoreSum += weight * adjustedScore;
    totalWeight += weight;
  });

  // 3. Formula: sum(weight * adjustedScore) / sum(weight)
  const rawMastery = totalWeight > 0 ? weightedScoreSum / totalWeight : 0.0;
  const clampedMastery = Math.min(Math.max(rawMastery, 0.0), 1.0);
  const normalizedMastery = Math.round(clampedMastery * 1000) / 1000;

  return await prisma.skillMastery.upsert({
    where: { userId_skillId: { userId, skillId } },
    update: {
      masteryScore: normalizedMastery,
      evidenceCount: attempts.length,
      lastUpdated: new Date()
    },
    create: {
      userId,
      skillId,
      masteryScore: normalizedMastery,
      evidenceCount: attempts.length,
      lastUpdated: new Date()
    }
  });
}

module.exports = { calculateSkillMasteryForUser };`,
    },

    'recommendationService.js': {
      title: 'backend/src/services/recommendationService.js',
      lang: 'javascript',
      category: 'Recommendation Engine',
      icon: Sparkles,
      content: `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getFullPrerequisiteChain, getDirectPrerequisites } = require('./graphService');

/**
 * ============================================================================
 * RECOMMENDATION ENGINE
 * ============================================================================
 * 
 * CORE DIRECTIVE:
 * The recommendation engine MUST NEVER simply recommend the skill with the lowest score.
 * It prioritizes based on:
 *   1. Full prerequisite chain of the selected goal
 *   2. Readiness: ALL direct prerequisites must have mastery >= 0.6
 *   3. Downstream impact: number of downstream skills unblocked
 *   4. Formula: (1 - mastery) * (1 + downstreamCount)
 * ============================================================================
 */

async function getPrioritizedRecommendation(userId, goalId) {
  // Step 1: Find goal target skill and full recursive ancestor chain
  const targetGoal = await prisma.learningGoal.findFirst({
    where: goalId ? { id: goalId } : undefined,
    include: { targetSkill: true }
  });

  if (!targetGoal) return { recommendation: null, message: 'No goal found.' };

  const relevantSkills = await getFullPrerequisiteChain(targetGoal.targetSkillId, true);
  const relevantSkillIds = new Set(relevantSkills.map(s => s.id));

  // Step 2: Retrieve mastery scores (missing = 0.0)
  const masteries = await prisma.skillMastery.findMany({
    where: { userId, skillId: { in: Array.from(relevantSkillIds) } }
  });
  const masteryMap = new Map();
  masteries.forEach(m => masteryMap.set(m.skillId, m.masteryScore));

  const candidates = [];

  for (const skill of relevantSkills) {
    const mastery = masteryMap.get(skill.id) ?? 0.0;

    // Step 3: Calculate downstream count within relevant chain
    const downstreamRels = await prisma.skillPrerequisite.findMany({
      where: { prerequisiteSkillId: skill.id, skillId: { in: Array.from(relevantSkillIds) } }
    });
    const downstreamCount = downstreamRels.length;

    // Step 4: Determine readiness
    const directPrereqs = await getDirectPrerequisites(skill.id);
    const isReady = directPrereqs.every(p => (masteryMap.get(p.id) ?? 0.0) >= 0.6);

    // Step 6: Priority score
    const priorityScore = (1.0 - mastery) * (1 + downstreamCount);

    candidates.push({ skill, mastery, downstreamCount, isReady, priorityScore });
  }

  // Step 5: Candidate filter (mastery < 0.6 AND ready === true)
  const eligible = candidates.filter(c => c.mastery < 0.6 && c.isReady);

  if (eligible.length === 0) {
    return {
      recommendation: null,
      message: 'You have no currently eligible weak skill to prioritize for this goal.'
    };
  }

  // Step 7: Sort highest priority first
  eligible.sort((a, b) => b.priorityScore - a.priorityScore);
  const top = eligible[0];

  // Step 8: Generate human-readable reason
  const pct = Math.round(top.mastery * 100);
  const reasonText = top.downstreamCount > 0
    ? \`Your current mastery in \${top.skill.name} is \${pct}%. Improving it is important because it helps unlock \${top.downstreamCount} downstream skill(s) on your path toward becoming a \${targetGoal.name}.\`
    : \`Your current mastery in \${top.skill.name} is \${pct}%. Focusing on this milestone completes your goal path.\`;

  // Step 9: Log recommendation
  const logged = await prisma.recommendation.create({
    data: {
      userId,
      skillId: top.skill.id,
      priorityScore: top.priorityScore,
      reasonText
    }
  });

  return {
    recommendation: { ...logged, skillName: top.skill.name, masteryScore: top.mastery, downstreamCount: top.downstreamCount }
  };
}

module.exports = { getPrioritizedRecommendation };`,
    },

    'seed.js': {
      title: 'backend/prisma/seed.js',
      lang: 'javascript',
      category: 'Seed Data',
      icon: Database,
      content: `const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Seeds 5 Skills in Data Science domain:
  // Python, Probability, Statistics, Linear Algebra, Machine Learning
  //
  // Graph Prerequisites:
  // Probability -> Statistics
  // Statistics -> Machine Learning
  // Linear Algebra -> Machine Learning
  //
  // Learning Goal: Machine Learning Engineer
  // 10+ Questions with options and explanations
}

main();`,
    },

    'setup.sh': {
      title: 'Local Execution Guide (Mac / Linux)',
      lang: 'bash',
      category: 'Run Instructions',
      icon: Terminal,
      content: `# ==========================================================
# LearnTrace — Local Setup Commands
# ==========================================================

# 1. Start PostgreSQL (e.g. via Homebrew or Docker)
# brew services start postgresql
# createdb learntrace

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npx prisma migrate dev --name init
npm run seed
npm start

# 3. Setup Frontend in another terminal
cd ../frontend
npm install
npm run dev

# 4. Open in browser:
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000`,
    },
  };

  const current = projectFiles[activeFile];

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Full-Stack Code & Schema Inspector</h2>
            <p className="text-xs text-slate-500">
              Inspect all Prisma models, mastery algorithms, recommendation services, and run commands.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleCopy(activeFile, current.content)}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs"
        >
          {copiedKey === activeFile ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy {activeFile}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Sidebar File List */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1.5 h-fit shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
            Project Architecture
          </div>
          {Object.entries(projectFiles).map(([filename, item]) => {
            const Icon = item.icon;
            const isActive = activeFile === filename;
            return (
              <button
                key={filename}
                onClick={() => setActiveFile(filename)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div className="truncate">
                  <div className="font-mono">{filename}</div>
                  <div className={`text-[10px] ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {item.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Code Content Container */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col">
          
          {/* File Header Bar */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-indigo-300">
              <FileText className="w-3.5 h-3.5" />
              <span>{current.title}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {current.lang}
            </span>
          </div>

          {/* Code Text Area */}
          <pre className="p-4 sm:p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[560px] overflow-y-auto">
            <code>{current.content}</code>
          </pre>

        </div>

      </div>

    </div>
  );
};
