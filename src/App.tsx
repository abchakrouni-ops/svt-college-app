/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp, TabType } from './context/AppContext';
import { Header } from './components/common/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { DashboardView } from './components/dashboard/DashboardView';
import { ClassesView } from './components/classes/ClassesView';
import { CahierTextesView } from './components/cahier/CahierTextesView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { ProgressionView } from './components/progression/ProgressionView';
import { FichesPedagogiquesView } from './components/fiches/FichesPedagogiquesView';
import { EvaluationsView } from './components/evaluations/EvaluationsView';
import { RemediationView } from './components/remediation/RemediationView';
import { LibraryView } from './components/library/LibraryView';
import { BackupView } from './components/backup/BackupView';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  GraduationCap,
  Sparkles,
  BarChart2,
  FolderArchive,
  Database
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-medium">Chargement du carnet pédagogique SVT Maroc...</p>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'classes':
        return <ClassesView />;
      case 'cahier':
        return <CahierTextesView />;
      case 'schedule':
        return <ScheduleView />;
      case 'progression':
        return <ProgressionView />;
      case 'fiches':
        return <FichesPedagogiquesView />;
      case 'evaluations':
        return <EvaluationsView />;
      case 'remediation':
        return <RemediationView />;
      case 'library':
        return <LibraryView />;
      case 'backup':
        return <BackupView />;
      default:
        return <DashboardView />;
    }
  };

  const mobileNavItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
    { id: 'cahier', label: 'Cahier', icon: BookOpen },
    { id: 'classes', label: 'Classes', icon: Users },
    { id: 'fiches', label: 'Fiches', icon: GraduationCap },
    { id: 'evaluations', label: 'Notes', icon: BarChart2 }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 md:pb-0">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SVT Collège Maroc</span>
            <span aria-hidden="true">·</span>
            <span>Niveaux 1AC & 2AC</span>
            <span aria-hidden="true">·</span>
            <span>Royaume du Maroc</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Conforme aux Orientations Pédagogiques Officielles du MENPS · Stockage Local Sécurisé & Autonome
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Quick Navigation Bar (height < 15% viewport) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-md text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
