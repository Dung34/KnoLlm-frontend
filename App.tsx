'use client'

import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import CreateNotebookModal from './components/CreateNotebookModal';
import Workspace from './components/Workspace';
import { Project, User, AppView, CreateProjectFormData } from './types';

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Minh Nguyen',
  email: 'minh@knollm.ai',
  avatarUrl: 'https://picsum.photos/id/64/200/200'
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Nghiên cứu Thị trường AI 2024',
    sourceCount: 12,
    lastEdited: '2 giờ',
    emoji: '📈',
    isPinned: true,
    colorGradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)'
  },
  {
    id: 'p2',
    title: 'Lịch sử kiến trúc Việt Nam',
    sourceCount: 5,
    lastEdited: '1 ngày',
    emoji: '🏛️',
    isPinned: false,
    colorGradient: 'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)'
  },
  {
    id: 'p3',
    title: 'Ghi chú sinh học tế bào',
    sourceCount: 8,
    lastEdited: '3 ngày',
    emoji: '🧬',
    isPinned: false,
    colorGradient: 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)'
  }
];

const GRADIENTS = [
  'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', // Indigo
  'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)', // Green
  'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)', // Yellow
  'linear-gradient(135deg, #ffedd5 0%, #fdba74 100%)', // Orange
  'linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)', // Pink
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Handlers
  const handleLogin = () => {
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentView(AppView.AUTH);
  };

  const handleCreateProject = (data: CreateProjectFormData) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: data.title,
      sourceCount: 0,
      lastEdited: 'Vừa xong',
      emoji: data.emoji,
      isPinned: false,
      colorGradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
    };

    setProjects([newProject, ...projects]);
    setIsCreateModalOpen(false);

    // Auto open new project
    setActiveProjectId(newProject.id);
    setCurrentView(AppView.WORKSPACE);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa notebook này không?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentView(AppView.WORKSPACE);
  };

  const handleBackToDashboard = () => {
    setActiveProjectId(null);
    setCurrentView(AppView.DASHBOARD);
  };

  // Get active project data
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <>
      {currentView === AppView.AUTH && (
        <AuthScreen onLogin={handleLogin} />
      )}

      {currentView === AppView.DASHBOARD && (
        <Dashboard
          user={MOCK_USER}
          projects={projects}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onLogout={handleLogout}
          onDeleteProject={handleDeleteProject}
          onOpenProject={handleOpenProject}
        />
      )}

      {currentView === AppView.WORKSPACE && activeProject && (
        <Workspace
          project={activeProject}
          onBack={handleBackToDashboard}
        />
      )}

      <CreateNotebookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
};

export default App;
