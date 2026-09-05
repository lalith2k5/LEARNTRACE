import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Network, 
  GraduationCap, 
  Target, 
  LogOut, 
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  User as UserIcon,
  Settings,
  ShieldCheck,
  TrendingUp,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ProfileModal } from './ProfileModal';
import { BrandLogo } from './BrandLogo';

export type NavTab = 'dashboard' | 'graph' | 'quiz' | 'goals' | 'research';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onRefreshAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onRefreshAll }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const navItems: { 
    id: NavTab; 
    label: string; 
    shortLabel: string;
    description: string;
    icon: React.FC<{ className?: string }>; 
    badge?: string;
  }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      shortLabel: 'Dashboard',
      description: 'Mastery overview & recommendations', 
      icon: LayoutDashboard 
    },
    { 
      id: 'graph', 
      label: 'Knowledge Graph', 
      shortLabel: 'Graph',
      description: 'Skill map & prerequisite dependency chains', 
      icon: Network 
    },
    { 
      id: 'quiz', 
      label: 'Diagnostic Practice', 
      shortLabel: 'Practice',
      description: 'Adaptive diagnostic assessments', 
      icon: GraduationCap,
      badge: 'Live'
    },
    { 
      id: 'goals', 
      label: 'Curriculum Goals', 
      shortLabel: 'Goals',
      description: 'Target milestones & prerequisite chains', 
      icon: Target 
    },
    { 
      id: 'research', 
      label: 'Research & BKT', 
      shortLabel: 'Research',
      description: 'Empirical benchmarks, BKT vs DKT simulations & psychometrics', 
      icon: FlaskConical,
      badge: 'Lab'
    },
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        
        {/* Top Main Bar: Clean Brand & Refined Profile Action */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Executive Brand Logo & Typography */}
            <div 
              id="brand-logo"
              className="flex items-center cursor-pointer select-none" 
              onClick={() => setActiveTab('dashboard')}
            >
              <BrandLogo 
                size="md" 
                interactive={true} 
                subtitle="Cognitive Knowledge Graph & Adaptive Mastery Platform"
              />
            </div>

            {/* Right Header Area: Refined Profile Section */}
            <div className="flex items-center gap-3">
              
              {/* Professional Profile Trigger & Menu */}
              <div className="relative">
                <button
                  id="btn-user-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 py-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/90 hover:border-slate-300 transition-all cursor-pointer text-left shadow-2xs group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white text-xs font-bold flex items-center justify-center shadow-xs ring-1 ring-[#1877F2]/30">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                      {user?.email ? user.email.split('@')[0] : 'Learner'}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-slate-500 font-medium">Online Learner</span>
                    </div>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Highly Polished Profile Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserDropdownOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -4 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs"
                      >
                        {/* User Identity Banner */}
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-[#1877F2] text-white text-[11px] font-bold flex items-center justify-center">
                              {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-slate-900 truncate">{user?.email}</div>
                              <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                                <ShieldCheck className="w-3 h-3" />
                                Active Session
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Profile Actions */}
                        <div className="py-1 space-y-1">
                          <button
                            id="btn-open-profile-details"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setProfileModalOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer font-semibold transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-[#1877F2]" />
                            <span>Learner Profile & Analytics</span>
                          </button>

                          <button
                            id="btn-profile-dropdown-goals"
                            onClick={() => {
                              setActiveTab('goals');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                          >
                            <Target className="w-4 h-4 text-[#1877F2]" />
                            <span>Curriculum Goals</span>
                          </button>

                          <button
                            id="btn-profile-dropdown-research"
                            onClick={() => {
                              setActiveTab('research');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                          >
                            <FlaskConical className="w-4 h-4 text-indigo-600" />
                            <span>Research & BKT Sandbox</span>
                          </button>

                          <button
                            id="btn-profile-dropdown-settings"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setProfileModalOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer font-medium transition-colors"
                          >
                            <Settings className="w-4 h-4 text-slate-500" />
                            <span>Account Security & Reset</span>
                          </button>
                        </div>

                        {/* Sign Out Action */}
                        <div className="pt-1.5 mt-1 border-t border-slate-100">
                          <button
                            id="btn-dropdown-logout"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 cursor-pointer font-semibold transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer border border-slate-200"
                aria-label="Toggle navigation tabs"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Dedicated Primary Navigation Tab Bar (Prominently Highlighted, Smooth Transitions) */}
        <div className="hidden lg:block border-t border-slate-100 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 py-1.5" role="tablist">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
                      isActive
                        ? 'text-white bg-[#1877F2] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    {/* Smooth Active Background Indicator Slider */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-[#1877F2] rounded-lg shadow-xs -z-10"
                        transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                      />
                    )}

                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile / Tablet Accordion Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 overflow-hidden shadow-lg"
            >
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      id={`mobile-nav-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-[#1877F2] border border-blue-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#1877F2] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-slate-900">{item.label}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{item.description}</div>
                        </div>
                      </div>

                      {isActive && (
                        <CheckCircle2 className="w-4 h-4 text-[#1877F2] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Dedicated Comprehensive Profile & Account Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onNavigateToTab={setActiveTab}
        onRefreshAll={onRefreshAll}
      />
    </>
  );
};
