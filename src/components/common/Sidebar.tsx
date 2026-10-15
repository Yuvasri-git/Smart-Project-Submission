import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Clock, 
  Megaphone, 
  Users, 
  Building2, 
  UserCheck, 
  FileText, 
  CheckCircle, 
  FileCode2,
  CalendarDays,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenDeliverables: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileOpen,
  setMobileOpen,
  onOpenDeliverables
}) => {
  const { currentUser, projects, deadlines } = usePortal();

  const role = currentUser?.role || 'student';

  // Navigation items based on role
  const getNavItems = () => {
    const commonTop = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: 'Project Directory', icon: FolderGit2, badge: projects.length },
    ];

    let roleSpecific: { id: string; label: string; icon: any; badge?: number }[] = [];

    if (role === 'student') {
      roleSpecific = [
        { id: 'my-project', label: 'My Submission', icon: FileText },
      ];
    } else if (role === 'advisor') {
      const pendingReviews = projects.filter(
        p => p.advisorId === currentUser?.id && (p.status === 'Pending' || p.status === 'Under Review')
      ).length;
      roleSpecific = [
        { id: 'review-queue', label: 'Pending Reviews', icon: CheckCircle, badge: pendingReviews },
        { id: 'assigned-students', label: 'Assigned Students', icon: Users },
      ];
    } else if (role === 'hod') {
      roleSpecific = [
        { id: 'dept-projects', label: 'Dept Projects', icon: Building2 },
        { id: 'advisor-workload', label: 'Advisor Workload', icon: UserCheck },
        { id: 'hod-reports', label: 'Reports & Export', icon: FileText },
      ];
    } else if (role === 'admin') {
      roleSpecific = [
        { id: 'manage-users', label: 'User Management', icon: Users },
        { id: 'allocations', label: 'Advisor Allocations', icon: UserCheck },
        { id: 'manage-depts', label: 'Departments & AY', icon: Building2 },
        { id: 'system-stats', label: 'Institutional Analytics', icon: FileText },
      ];
    }

    const commonBottom = [
      { id: 'deadlines', label: 'Deadlines', icon: CalendarDays, badge: deadlines.filter(d => d.isActive).length },
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
    ];

    return [...commonTop, ...roleSpecific, ...commonBottom];
  };

  const navItems = getNavItems();

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          
          {/* User Role Card */}
          {currentUser && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100 flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] font-semibold text-blue-700 capitalize">
                  {currentUser.role === 'hod' ? 'HOD' : currentUser.role} Portal
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {currentUser.department}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Navigation Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Special Deliverables Section */}
          <div className="pt-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              B.Tech Project Submission
            </p>
            <button
              onClick={() => {
                onOpenDeliverables();
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              <FileCode2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>SQL Schema & PHP Source</span>
              <Sparkles className="w-3 h-3 text-indigo-500 ml-auto" />
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Academic Year</span>
            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[10px] font-bold text-blue-700">
              2025-2026
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Department of Information Technology
          </p>
        </div>
      </aside>
    </>
  );
};
