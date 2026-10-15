import React, { useState, useRef, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { UserRole } from '../../types';
import { NotificationDropdown } from './NotificationDropdown';
import { 
  GraduationCap, 
  Search, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  Database, 
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenDeliverables: () => void;
  onSelectProject?: (projectId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenDeliverables,
  onSelectProject,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { 
    currentUser, 
    logout, 
    switchUserRole, 
    searchQuery, 
    setSearchQuery, 
    notifications,
    resetAllData 
  } = usePortal();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Unread notification count for current user
  const unreadCount = notifications.filter(
    n => !n.read && (n.userId === 'all' || n.userId === currentUser?.id)
  ).length;

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; label: string; badge: string; color: string }[] = [
    { role: 'student', label: 'Student', badge: 'Student', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { role: 'advisor', label: 'Advisor', badge: 'Faculty', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { role: 'hod', label: 'HOD', badge: 'Dept Head', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { role: 'admin', label: 'Admin', badge: 'Administrator', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile hamburger + College Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3 cursor-pointer select-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    APEX ENGINEERING
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                    NAAC A++
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
                  Smart Project Submission Portal
                </p>
              </div>
            </div>
          </div>

          {/* Middle: Global Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, students, roll no, tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Demo Persona Switcher + Deliverables + Notifications + User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Persona Switcher (Crucial for evaluation!) */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Role:
              </span>
              {roles.map(r => {
                const isActive = currentUser?.role === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => switchUserRole(r.role)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                      isActive 
                        ? 'bg-white text-blue-700 shadow-xs font-bold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {/* B.Tech Project Deliverables & SQL Modal button */}
            <button
              onClick={onOpenDeliverables}
              title="View & Download database.sql, PHP APIs, and Setup Guide"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">SQL / PHP Code</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onSelectProject={onSelectProject}
              />
            </div>

            {/* Profile Dropdown */}
            {currentUser && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {currentUser.role}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {currentUser.department}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        My Profile & Settings
                      </button>

                      {/* Quick Role switch options inside menu for mobile/tablet */}
                      <div className="px-4 py-1.5 border-t border-slate-100">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                          Switch Persona
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {roles.map(r => (
                            <button
                              key={r.role}
                              onClick={() => {
                                switchUserRole(r.role);
                                setProfileMenuOpen(false);
                              }}
                              className={`text-[11px] px-2 py-1 rounded text-left transition-colors font-medium ${
                                currentUser.role === r.role
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          if (confirm('Reset portal back to default sample projects, users, and reviews?')) {
                            resetAllData();
                            setProfileMenuOpen(false);
                          }
                        }}
                        className="w-full px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 text-amber-500" />
                        Reset Demo Data
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
