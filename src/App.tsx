import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { SkillGraphView } from './components/SkillGraphView';
import { QuizAssessment } from './components/QuizAssessment';
import { GoalSelector } from './components/GoalSelector';
import { ResearchBenchmarkView } from './components/ResearchBenchmarkView';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Cpu } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [quizSkillId, setQuizSkillId] = useState<string | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleStartQuizForSkill = (skillId: string) => {
    setQuizSkillId(skillId);
    setActiveTab('quiz');
  };

  const handleRefreshAll = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 space-y-3">
        <Cpu className="w-10 h-10 animate-spin text-[#1877F2]" />
        <p className="text-sm font-semibold tracking-wide">Starting LearnTrace Knowledge Engine...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {authView === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              <LoginPage 
                initialEmail={authEmail}
                onSwitchToRegister={(prefillEmail?: string) => {
                  if (prefillEmail) setAuthEmail(prefillEmail);
                  setAuthView('register');
                }} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full flex justify-center"
            >
              <RegisterPage 
                initialEmail={authEmail}
                onSwitchToLogin={(prefillEmail?: string) => {
                  if (prefillEmail) setAuthEmail(prefillEmail);
                  setAuthView('login');
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshAll={handleRefreshAll}
      />

      {/* Main Container with smooth view transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key={`dash_${refreshTrigger}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <DashboardPage
                onStartQuizForSkill={handleStartQuizForSkill}
                onNavigateToGraph={() => setActiveTab('graph')}
                onNavigateToResearch={() => setActiveTab('research')}
                onNavigateToGoals={() => setActiveTab('goals')}
              />
            </motion.div>
          )}

          {activeTab === 'graph' && (
            <motion.div
              key={`graph_${refreshTrigger}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <SkillGraphView
                onStartQuizForSkill={handleStartQuizForSkill}
              />
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key={`quiz_${quizSkillId || 'all'}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <QuizAssessment
                initialSkillId={quizSkillId}
                onAssessmentCompleted={() => {
                  handleRefreshAll();
                  setActiveTab('dashboard');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <GoalSelector
                onGoalSelected={() => {
                  handleRefreshAll();
                  setActiveTab('dashboard');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'research' && (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <ResearchBenchmarkView
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Learner-Friendly Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 mt-8 text-xs text-slate-600 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">LearnTrace</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 text-[11px]">AI-Assisted Adaptive Learning & Knowledge Tracing</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Adaptive Diagnostic Practice</span>
            <span className="text-slate-300">•</span>
            <span>Prerequisite Skill Mapping</span>
            <span className="text-slate-300">•</span>
            <span>Personalized Learning Sequence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
