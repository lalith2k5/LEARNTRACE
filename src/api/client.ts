import {
  User,
  Skill,
  LearningGoal,
  UserGoal,
  Question,
  Attempt,
  SkillMastery,
  Recommendation,
  LearningPathStep,
  AiExplainResponse,
  SkillGap,
  LearningResource,
} from '../types';

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedToken = sessionStorage.getItem('learntrace_jwt');
      if (savedToken) {
        this.token = savedToken;
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('learntrace_jwt', token);
      } else {
        sessionStorage.removeItem('learntrace_jwt');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && !endpoint.includes('/auth/login')) {
      this.setToken(null);
    }

    if (!res.ok) {
      let errorMsg = `Request failed with status ${res.status}`;
      let errorCode: string | undefined = undefined;
      try {
        const errorData = await res.json();
        if (errorData.error) {
          errorMsg = errorData.error;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        }
        if (errorData.code) {
          errorCode = errorData.code;
        }
      } catch {
        // use default
      }
      throw new ApiError(errorMsg, res.status, errorCode);
    }

    return res.json();
  }

  // Auth
  async register(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async updateProfile(data: {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserStats(): Promise<{
    userId: string;
    email: string;
    createdAt?: string;
    totalAttempts: number;
    correctCount: number;
    accuracy: number;
    totalTimeSeconds: number;
    skillsSolid: number;
    skillsDeveloping: number;
    skillsNovice: number;
    totalSkills: number;
    currentGoal?: any;
  }> {
    return this.request('/user/stats');
  }

  async resetUserProgress(): Promise<{ message: string; totalAttempts: number }> {
    return this.request('/user/reset-progress', {
      method: 'POST',
    });
  }

  // Skills & Graph
  async getSkills(): Promise<Skill[]> {
    return this.request<Skill[]>('/skills');
  }

  async getSkillPrerequisites(skillId: string): Promise<{ skill: Skill; prerequisites: Skill[] }> {
    return this.request<{ skill: Skill; prerequisites: Skill[] }>(`/skills/${skillId}/prerequisites`);
  }

  async getSkillChain(skillId: string): Promise<{ skill: Skill; chain: Skill[] }> {
    return this.request<{ skill: Skill; chain: Skill[] }>(`/skills/${skillId}/chain`);
  }

  async getGraph(): Promise<{ nodes: any[]; edges: any[] }> {
    return this.request<{ nodes: any[]; edges: any[] }>('/skills/graph');
  }

  // Goals
  async getGoals(): Promise<LearningGoal[]> {
    return this.request<LearningGoal[]>('/goals');
  }

  async selectGoal(goalId: string): Promise<{ message: string; userGoal: UserGoal }> {
    return this.request<{ message: string; userGoal: UserGoal }>('/user-goals', {
      method: 'POST',
      body: JSON.stringify({ goalId }),
    });
  }

  async getCurrentGoal(): Promise<UserGoal> {
    return this.request<UserGoal>('/user-goals/current');
  }

  // Questions & Attempts
  async getQuestions(skillId?: string, includeAnswers: boolean = false): Promise<Question[]> {
    const params = new URLSearchParams();
    if (skillId) params.append('skill_id', skillId);
    if (includeAnswers) params.append('include_answers', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Question[]>(`/questions${query}`);
  }

  async submitAttempt(data: {
    questionId: string;
    answer: string;
    timeTakenSeconds: number;
    confidence: number;
    attemptNumber?: number;
  }): Promise<{
    success: boolean;
    correct: boolean;
    attempt: Attempt;
    priorMastery?: number;
    updatedMastery: SkillMastery;
    correctAnswerText?: string;
    explanation?: string;
  }> {
    return this.request('/attempts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAttempts(): Promise<Attempt[]> {
    return this.request<Attempt[]>('/attempts');
  }

  // Mastery
  async getMastery(): Promise<SkillMastery[]> {
    return this.request<SkillMastery[]>('/mastery');
  }

  async recalculateMastery(): Promise<{ userId: string; skillMasteries: SkillMastery[]; calculatedAt: string }> {
    return this.request('/mastery/recalculate', {
      method: 'POST',
    });
  }

  // Skill Gaps & Recommendations
  async getSkillGaps(goalId?: string): Promise<{ goalId: string; goalName: string; targetSkillName?: string; skillGaps: SkillGap[] }> {
    const query = goalId ? `?goal_id=${encodeURIComponent(goalId)}` : '';
    return this.request(`/skill-gaps${query}`);
  }

  async getRecommendation(goalId?: string): Promise<{
    recommendation: Recommendation | null;
    analysis?: any[];
    message?: string;
  }> {
    const query = goalId ? `?goal_id=${encodeURIComponent(goalId)}` : '';
    return this.request(`/recommendations${query}`);
  }

  // Learning Path
  async getLearningPath(goalId?: string): Promise<LearningPathStep[]> {
    const query = goalId ? `?goal_id=${encodeURIComponent(goalId)}` : '';
    return this.request<LearningPathStep[]>(`/learning-path${query}`);
  }

  // Learning Resources
  async getResources(skillId?: string, type?: string): Promise<LearningResource[]> {
    const params = new URLSearchParams();
    if (skillId) params.append('skillId', skillId);
    if (type) params.append('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<LearningResource[]>(`/resources${query}`);
  }

  async getSkillResources(skillId: string): Promise<LearningResource[]> {
    return this.request<LearningResource[]>(`/skills/${encodeURIComponent(skillId)}/resources`);
  }

  async getResource(resourceId: string): Promise<LearningResource> {
    return this.request<LearningResource>(`/resources/${encodeURIComponent(resourceId)}`);
  }

  // AI Diagnostic Explanation & Generation
  async explainQuestion(
    questionId: string,
    selectedAnswer?: string,
    confidence?: number,
    isCorrect?: boolean
  ): Promise<AiExplainResponse> {
    return this.request<AiExplainResponse>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedAnswer, confidence, isCorrect }),
    });
  }

  async generateAiQuestion(skillId: string): Promise<{ message: string; question: Question }> {
    return this.request<{ message: string; question: Question }>('/ai/generate-question', {
      method: 'POST',
      body: JSON.stringify({ skillId }),
    });
  }

  async enrichQuestionBank(params: {
    skillId?: string;
    count?: number;
    difficulty?: number;
    cognitiveCategory?: string;
  }): Promise<{
    success: boolean;
    message: string;
    generatedQuestions: Question[];
    totalInBank: number;
    stats: {
      totalQuestions: number;
      bySkill: Record<string, number>;
      byDifficulty: Record<number, number>;
      skillsCovered: number;
      totalSkillsInCurriculum: number;
    };
  }> {
    return this.request('/ai/generate-questions-bank', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async gradeOpenEnded(data: {
    skillId: string;
    prompt: string;
    studentResponse: string;
    selfConfidence?: number;
  }): Promise<{
    score: number;
    grade: string;
    feedback: string;
    conceptsIdentified: string[];
    conceptsMissed: string[];
    misconceptionsDetected: string[];
    cognitiveState: any;
    suggestedAction: string;
    attempt: Attempt;
    updatedMastery: SkillMastery;
  }> {
    return this.request('/ai/grade-open-ended', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Research Trace & Knowledge Tracing Benchmarks
  async getResearchTrace(): Promise<{ studentId: string; recordCount: number; records: any[] }> {
    return this.request('/research/trace');
  }

  async getBktComparison(): Promise<{ userId: string; modelsCompared: string[]; skills: any[] }> {
    return this.request('/research/bkt-compare');
  }

  async simulateTrace(data: {
    customSequence?: Array<{ correct: boolean; confidence?: number; timeTakenSeconds?: number; questionText?: string }>;
    bktParams?: any;
    skillId?: string;
  }): Promise<{
    sequenceLength: number;
    bktParams: any;
    simulationPoints: any[];
  }> {
    return this.request('/research/simulate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async evaluateDataset(data: {
    datasetName?: string;
    records: Array<{
      userId: string;
      skillId: string;
      correct: boolean | number;
      confidence?: number;
      timeTakenSeconds?: number;
    }>;
    bktParams?: any;
  }): Promise<{
    datasetName: string;
    totalRecords: number;
    uniqueStudents: number;
    uniqueSkills: number;
    metrics: {
      learnTrace: any;
      bkt: any;
      dkt: any;
    };
    keyFindings: string[];
  }> {
    return this.request('/research/evaluate-dataset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBenchmarkSample(type: 'assistments' | 'ednet' | 'synthetic'): Promise<{
    type: string;
    recordCount: number;
    records: any[];
  }> {
    return this.request(`/research/benchmark-samples/${type}`);
  }

  async getQuestionStats(): Promise<{
    totalQuestions: number;
    bySkill: Record<string, number>;
    byDifficulty: Record<number, number>;
    skillsCovered: number;
  }> {
    return this.request('/questions/stats');
  }

  async createCustomGoal(data: {
    name: string;
    targetSkillId: string;
    description?: string;
  }): Promise<{ success: boolean; message: string; goal: LearningGoal }> {
    return this.request('/goals/custom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Demo Reset
  async resetDemo(): Promise<{ message: string }> {
    return this.request('/reset-demo', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
