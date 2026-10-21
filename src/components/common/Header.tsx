import React, { useState } from 'react';
import { useApp, TabType } from '../../context/AppContext';
import {
  Menu,
  X,
  Database,
  Calendar,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  FolderArchive,
  BarChart2,
  Clock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, state } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart2 },
    { id: 'classes', label: 'Classes & Élèves', icon: Users },
    { id: 'cahier', label: 'Cahier de textes', icon: BookOpen },
    { id: 'schedule', label: 'Emploi du temps', icon: Calendar },
    { id: 'progression', label: 'Progression 1AC/2AC', icon: Clock },
    { id: 'fiches', label: 'Fiches pédagogiques', icon: GraduationCap },
    { id: 'evaluations', label: 'Notes & Évaluations', icon: BarChart2 },
    { id: 'remediation', label: 'Soutien & Remédiation', icon: Sparkles },
    { id: 'library', label: 'Bibliothèque SVT', icon: FolderArchive },
    { id: 'backup', label: 'Sauvegarde & Données', icon: Database }
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 no-print">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Clean Single-Line Nav Links) — Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap block">
              SVT Collège Maroc
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap font-medium">
              1AC & 2AC · {state.teacher.schoolName || 'Collège Marocain'}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Desktop */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600">
          {navItems.slice(0, 7).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1.5 cursor-pointer text-xs font-semibold ${
                  isActive
                    ? 'text-emerald-700 border-b-2 border-emerald-600 -mb-px'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleNavClick('backup')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sauvegarde</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sub-navigation bar for tablet/medium screens */}
      <div className="hidden md:flex xl:hidden border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 overflow-x-auto scrollbar-none py-2 gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-emerald-100 text-emerald-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
