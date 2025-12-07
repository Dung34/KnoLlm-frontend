import React, { useState } from 'react';
import { 
  Home, 
  Star, 
  Clock, 
  Settings, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Brain, 
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { Project, User } from '../types';
import { Button, Card } from './ui/Components';

interface DashboardProps {
  user: User;
  projects: Project[];
  onOpenCreateModal: () => void;
  onLogout: () => void;
  onDeleteProject: (id: string) => void;
  onOpenProject: (projectId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  projects, 
  onOpenCreateModal, 
  onLogout,
  onDeleteProject,
  onOpenProject
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'starred' | 'recent'>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter projects based on tab (Mock logic for visual demo)
  const filteredProjects = projects.filter(p => {
    if (activeTab === 'starred') return p.isPinned;
    // For 'recent', we would usually sort by date, but just showing all for now in this demo
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`
        flex flex-col border-r border-slate-200 bg-white transition-all duration-300
        ${sidebarCollapsed ? 'w-20 items-center' : 'w-64'}
      `}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-primary-600">
            <Brain className="w-8 h-8" />
            {!sidebarCollapsed && <span className="font-bold font-heading text-lg text-slate-900">KnoLlm</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          <SidebarItem 
            icon={<Home className="w-5 h-5" />} 
            label="Trang chủ" 
            isActive={activeTab === 'home'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('home')}
          />
          <SidebarItem 
            icon={<Star className="w-5 h-5" />} 
            label="Đã ghim" 
            isActive={activeTab === 'starred'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('starred')}
          />
          <SidebarItem 
            icon={<Clock className="w-5 h-5" />} 
            label="Gần đây" 
            isActive={activeTab === 'recent'} 
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab('recent')}
          />
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button 
            onClick={() => {}} 
            className="flex w-full items-center gap-3 p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
          >
             <Moon className="w-5 h-5" />
             {!sidebarCollapsed && <span className="text-sm font-medium">Giao diện</span>}
          </button>
          
          <div className={`flex items-center gap-3 p-2 rounded-lg mt-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
             <img 
               src={user.avatarUrl || "https://picsum.photos/200"} 
               alt="User" 
               className="w-8 h-8 rounded-full ring-2 ring-slate-100"
             />
             {!sidebarCollapsed && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                 <div className="flex items-center gap-2">
                   <Settings className="w-3 h-3 text-slate-400 cursor-pointer hover:text-primary-600" />
                   <LogOut onClick={onLogout} className="w-3 h-3 text-slate-400 cursor-pointer hover:text-red-500" />
                 </div>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Chào buổi sáng, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 text-sm">Bạn đã sẵn sàng học tập chưa?</p>
          </div>

          <div className="flex items-center gap-4">
             {/* Search Bar Trigger */}
             <button className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-400 text-sm w-64 hover:border-slate-300 transition-colors shadow-sm">
                <Search className="w-4 h-4" />
                <span>Tìm kiếm dự án...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
             </button>

             <Button onClick={onOpenCreateModal} className="gap-2 shadow-lg shadow-primary-500/20">
               <Plus className="w-4 h-4" />
               Tạo Notebook mới
             </Button>
          </div>
        </header>

        {/* Scrollable Grid Area */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <Brain className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-lg font-medium">Chưa có dự án nào</p>
              <p className="text-sm">Hãy tạo notebook đầu tiên để bắt đầu</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  isDropdownOpen={activeDropdown === project.id}
                  toggleDropdown={() => setActiveDropdown(activeDropdown === project.id ? null : project.id)}
                  onDelete={() => onDeleteProject(project.id)}
                  onOpen={() => onOpenProject(project.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, collapsed, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }
      ${collapsed ? 'justify-center' : ''}
    `}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </button>
);

interface ProjectCardProps {
  project: Project;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  isDropdownOpen, 
  toggleDropdown,
  onDelete,
  onOpen
}) => (
  <div 
    onClick={onOpen}
    className="group relative bg-white border border-slate-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 cursor-pointer"
  >
    {/* Card Cover */}
    <div 
      className="h-28 rounded-xl mb-4 flex items-center justify-center text-4xl shadow-inner"
      style={{ background: project.colorGradient }}
    >
      <span className="drop-shadow-sm filter">{project.emoji}</span>
    </div>

    {/* Content */}
    <div className="space-y-1">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-slate-900 truncate pr-2" title={project.title}>
          {project.title}
        </h3>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleDropdown(); }}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-xs text-slate-500 flex items-center gap-2">
        <span>{project.sourceCount} nguồn</span>
        <span className="w-1 h-1 bg-slate-300 rounded-full" />
        <span>Sửa {project.lastEdited} trước</span>
      </p>
    </div>

    {/* Dropdown Menu (Simulated) */}
    {isDropdownOpen && (
      <>
        <div 
          className="fixed inset-0 z-10 cursor-default" 
          onClick={(e) => { e.stopPropagation(); toggleDropdown(); }} 
        />
        <div className="absolute right-4 top-40 z-20 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-100">
          <button className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">Đổi tên</button>
          <button className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50">Ghim</button>
          <div className="h-px bg-slate-100 my-1" />
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50"
          >
            Xóa
          </button>
        </div>
      </>
    )}
  </div>
);

export default Dashboard;
