import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { User, UserRole, ProjectCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  CalendarDays, 
  Megaphone, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  UserCheck, 
  BarChart3, 
  PieChart, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  UserPlus
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectProject: (projectId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectProject }) => {
  const {
    currentUser,
    users,
    departments,
    academicYears,
    projects,
    deadlines,
    announcements,
    addUser,
    updateUser,
    deleteUser,
    assignAdvisorToStudent,
    addDepartment,
    addDeadline,
    toggleDeadline,
    addAnnouncement,
    deleteAnnouncement,
    deleteProject
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'allocations' | 'departments' | 'deadlines'>('overview');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

  // Add User Modal State
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserDept, setNewUserDept] = useState(departments[0]?.name || 'Information Technology');
  const [newUserRollNo, setNewUserRollNo] = useState('');
  const [newUserFacultyId, setNewUserFacultyId] = useState('');

  // Add Deadline Modal State
  const [addDeadlineModalOpen, setAddDeadlineModalOpen] = useState(false);
  const [dlTitle, setDlTitle] = useState('');
  const [dlCategory, setDlCategory] = useState<ProjectCategory>('Mini Project');
  const [dlDept, setDlDept] = useState('All Departments');
  const [dlDueDate, setDlDueDate] = useState('');
  const [dlDesc, setDlDesc] = useState('');

  // Add Announcement Modal State
  const [addAncModalOpen, setAddAncModalOpen] = useState(false);
  const [ancTitle, setAncTitle] = useState('');
  const [ancContent, setAncContent] = useState('');
  const [ancPriority, setAncPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Add Department State
  const [addDeptModalOpen, setAddDeptModalOpen] = useState(false);
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptHod, setDeptHod] = useState('');
  const [deptEmail, setDeptEmail] = useState('');

  // Quick stats
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalAdvisors = users.filter(u => u.role === 'advisor').length;
  const totalHODs = users.filter(u => u.role === 'hod').length;
  const totalProjects = projects.length;

  const approvedProjects = projects.filter(p => p.status === 'Approved').length;
  const pendingProjects = projects.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
  const correctionProjects = projects.filter(p => p.status === 'Correction Required').length;

  // Filtered users
  const filteredUsers = users.filter(u => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch) {
      const term = userSearch.toLowerCase();
      const matchName = u.name.toLowerCase().includes(term);
      const matchEmail = u.email.toLowerCase().includes(term);
      const matchRoll = u.rollNumber?.toLowerCase().includes(term);
      const matchFac = u.facultyId?.toLowerCase().includes(term);
      if (!matchName && !matchEmail && !matchRoll && !matchFac) return false;
    }
    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      department: newUserDept,
      rollNumber: newUserRole === 'student' ? newUserRollNo.trim() : undefined,
      facultyId: newUserRole !== 'student' ? newUserFacultyId.trim() : undefined,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`,
    });

    setAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRollNo('');
    setNewUserFacultyId('');
  };

  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlTitle.trim() || !dlDueDate) return;

    addDeadline({
      title: dlTitle.trim(),
      category: dlCategory,
      department: dlDept,
      dueDate: dlDueDate,
      description: dlDesc.trim(),
      academicYear: '2025-2026',
      isActive: true,
    });

    setAddDeadlineModalOpen(false);
    setDlTitle('');
    setDlDueDate('');
    setDlDesc('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle.trim() || !ancContent.trim()) return;

    addAnnouncement({
      title: ancTitle.trim(),
      content: ancContent.trim(),
      postedBy: `${currentUser?.name} (Dean of Academics)`,
      department: 'All',
      priority: ancPriority,
    });

    setAddAncModalOpen(false);
    setAncTitle('');
    setAncContent('');
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptCode.trim() || !deptName.trim()) return;

    addDepartment({
      code: deptCode.trim().toUpperCase(),
      name: deptName.trim(),
      hodName: deptHod.trim() || 'Dr. Appointed HOD',
      hodEmail: deptEmail.trim() || `hod.${deptCode.toLowerCase()}@apex.edu`,
      totalStudents: 120,
      totalFaculty: 8,
    });

    setAddDeptModalOpen(false);
    setDeptCode('');
    setDeptName('');
    setDeptHod('');
    setDeptEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Dean & System Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-rose-500/30 text-rose-200 border border-rose-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              System Administrator Portal
            </span>
            <span className="text-slate-300 text-xs">• Apex Engineering College</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Institutional Governance & Project Central Control
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-2xl">
            Manage user accounts, assign faculty advisors, schedule institution-wide submission deadlines, and monitor engineering project analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddUserModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Students</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalStudents}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active candidates</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Faculty Advisors</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalAdvisors}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Project guides</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Department Heads</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalHODs}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{departments.length} departments</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Project Submissions</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">{totalProjects}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{approvedProjects} approved</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs flex gap-2 sm:gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'College Analytics & Status', icon: BarChart3 },
          { id: 'users', label: `User Accounts (${users.length})`, icon: Users },
          { id: 'allocations', label: 'Advisor Allocations', icon: UserCheck },
          { id: 'departments', label: 'Departments & AY', icon: Building2 },
          { id: 'deadlines', label: `Deadlines & Notices (${deadlines.length})`, icon: CalendarDays },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status Breakdown Visual */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                Submission Lifecycle Breakdown
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Approved for Final Defense
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">{approvedProjects} ({totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalProjects > 0 ? (approvedProjects / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      Pending / Under Review
                    </span>
                    <span className="font-mono text-blue-700 font-bold">{pendingProjects} ({totalProjects > 0 ? Math.round((pendingProjects / totalProjects) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalProjects > 0 ? (pendingProjects / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Correction Required
                    </span>
                    <span className="font-mono text-amber-700 font-bold">{correctionProjects} ({totalProjects > 0 ? Math.round((correctionProjects / totalProjects) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalProjects > 0 ? (correctionProjects / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Department-wise Projects Visual */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Department Submissions Volume
              </h3>

              <div className="space-y-3">
                {departments.map((dept) => {
                  const count = projects.filter(p => p.department.toLowerCase() === dept.name.toLowerCase()).length;
                  const pct = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
                  return (
                    <div key={dept.id}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>{dept.name} ({dept.code})</span>
                        <span className="font-mono text-slate-600">{count} projects ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Master Submissions Management Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Institutional Projects Registry ({projects.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Dept</th>
                    <th className="py-2.5 px-3">Advisor</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 max-w-xs truncate">
                        {proj.title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{proj.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{proj.department}</td>
                      <td className="py-2.5 px-3 text-slate-700">{proj.advisorName}</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={proj.status} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectProject(proj.id)}
                            className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete project "${proj.title}"?`)) {
                                deleteProject(proj.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {['all', 'student', 'advisor', 'hod', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    userRoleFilter === r
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <button
                onClick={() => setAddUserModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Roll / Faculty ID</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        u.role === 'admin' ? 'bg-rose-100 text-rose-800' :
                        u.role === 'hod' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'advisor' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{u.department}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {u.rollNumber || u.facultyId || '-'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete account for ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ADVISOR ALLOCATIONS */}
      {activeTab === 'allocations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Student-Advisor Guide Allocation Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign or change designated faculty guides for each student
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Current Assigned Advisor</th>
                  <th className="py-3 px-4 text-right">Change / Reassign Guide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.filter(u => u.role === 'student').map((student) => {
                  const currentAdv = users.find(u => u.id === student.assignedAdvisorId);
                  const availableAdvisors = users.filter(u => u.role === 'advisor');

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{student.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{student.rollNumber}</td>
                      <td className="py-3 px-4 text-slate-600">{student.department}</td>
                      <td className="py-3 px-4 font-semibold text-blue-700">
                        {currentAdv?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={student.assignedAdvisorId || ''}
                          onChange={(e) => assignAdvisorToStudent(student.id, e.target.value)}
                          className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                        >
                          <option value="">Select Guide...</option>
                          {availableAdvisors.map(adv => (
                            <option key={adv.id} value={adv.id}>
                              {adv.name} ({adv.department})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DEPARTMENTS & ACADEMIC YEARS */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departments */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Departments Registry</h3>
              <button
                onClick={() => setAddDeptModalOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                + Add Dept
              </button>
            </div>
            <div className="space-y-2">
              {departments.map((d) => (
                <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{d.name}</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded ml-2">
                      {d.code}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      HOD: {d.hodName} ({d.hodEmail})
                    </p>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {d.totalStudents} students
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Years */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Academic Years & Semesters</h3>
            </div>
            <div className="space-y-2">
              {academicYears.map((ay) => (
                <div key={ay.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 font-mono text-sm">{ay.year}</span>
                    {ay.isCurrent && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full ml-2">
                        Active AY
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    {ay.totalProjects} recorded projects
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DEADLINES & ANNOUNCEMENTS */}
      {activeTab === 'deadlines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deadlines */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Submission Deadlines</h3>
              <button
                onClick={() => setAddDeadlineModalOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                + Schedule Deadline
              </button>
            </div>
            <div className="space-y-2.5">
              {deadlines.map((dl) => (
                <div key={dl.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{dl.title}</span>
                    <span className="font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Due: {dl.dueDate}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{dl.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{dl.department} • {dl.category}</span>
                    <button
                      onClick={() => toggleDeadline(dl.id)}
                      className={`font-semibold ${dl.isActive ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                      {dl.isActive ? 'Active' : 'Closed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Campus Circulars & Notices</h3>
              <button
                onClick={() => setAddAncModalOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                + Post Notice
              </button>
            </div>
            <div className="space-y-2.5">
              {announcements.map((anc) => (
                <div key={anc.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{anc.title}</span>
                    <button
                      onClick={() => deleteAnnouncement(anc.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{anc.content}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>By: {anc.postedBy}</span>
                    <span>{anc.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Campus Account</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@student.apex.edu"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Role *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="student">Student</option>
                    <option value="advisor">Advisor</option>
                    <option value="hod">HOD</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Department *</label>
                  <select
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newUserRole === 'student' ? (
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Student Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="21IT120"
                    value={newUserRollNo}
                    onChange={(e) => setNewUserRollNo(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="font-semibold block text-slate-700 mb-1">Faculty ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="FAC-IT-099"
                    value={newUserFacultyId}
                    onChange={(e) => setNewUserFacultyId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DEADLINE MODAL */}
      {addDeadlineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Schedule Submission Deadline</h3>
            <form onSubmit={handleCreateDeadline} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Deadline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Phase-2 Complete Source Code & Presentation"
                  value={dlTitle}
                  onChange={(e) => setDlTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={dlDueDate}
                  onChange={(e) => setDlDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Description / Instructions</label>
                <textarea
                  rows={3}
                  value={dlDesc}
                  onChange={(e) => setDlDesc(e.target.value)}
                  placeholder="Mandatory submission requirements..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddDeadlineModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Publish Deadline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ANNOUNCEMENT MODAL */}
      {addAncModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Broadcast Campus Circular</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Final Viva Voce Examination Schedule"
                  value={ancTitle}
                  onChange={(e) => setAncTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Priority Level</label>
                <select
                  value={ancPriority}
                  onChange={(e) => setAncPriority(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="low">Low Notice</option>
                  <option value="medium">Standard Notice</option>
                  <option value="high">High Priority Alert</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 mb-1">Circular Content *</label>
                <textarea
                  rows={4}
                  required
                  value={ancContent}
                  onChange={(e) => setAncContent(e.target.value)}
                  placeholder="Enter notice details for students and faculty..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddAncModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DEPARTMENT MODAL */}
      {addDeptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Academic Department</h3>
            <form onSubmit={handleCreateDept} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Department Code * (e.g. AI-DS)</label>
                <input
                  type="text"
                  required
                  placeholder="AI-DS"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg uppercase"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Artificial Intelligence & Data Science"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddDeptModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
