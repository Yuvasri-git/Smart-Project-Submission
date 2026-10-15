import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Building2, 
  Users, 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  UserCheck, 
  ChevronRight, 
  Award,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

interface HODDashboardProps {
  onSelectProject: (projectId: string) => void;
}

export const HODDashboard: React.FC<HODDashboardProps> = ({ onSelectProject }) => {
  const { currentUser, projects, users, departments } = usePortal();

  // Department selector (defaults to current HOD's department)
  const defaultDept = currentUser?.department || 'Information Technology';
  const [selectedDept, setSelectedDept] = useState(defaultDept);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Department projects
  const deptProjects = projects.filter(p => 
    selectedDept === 'All' ? true : p.department.toLowerCase() === selectedDept.toLowerCase()
  );

  // Department Advisors
  const deptAdvisors = users.filter(u => 
    u.role === 'advisor' && (selectedDept === 'All' ? true : u.department.toLowerCase() === selectedDept.toLowerCase())
  );

  // Metrics
  const totalProjects = deptProjects.length;
  const approvedProjects = deptProjects.filter(p => p.status === 'Approved').length;
  const pendingProjects = deptProjects.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
  const correctionProjects = deptProjects.filter(p => p.status === 'Correction Required').length;
  const approvalRate = totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0;

  // Filtered projects
  const filteredProjects = deptProjects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = p.title.toLowerCase().includes(term);
      const matchesStudent = p.studentName.toLowerCase().includes(term) || p.studentRollNumber.toLowerCase().includes(term);
      const matchesAdvisor = p.advisorName.toLowerCase().includes(term);
      if (!matchesTitle && !matchesStudent && !matchesAdvisor) return false;
    }
    return true;
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Project ID,Title,Category,Department,Student,Roll Number,Advisor,Status,Version,Score,Submitted Date'];
    const rows = deptProjects.map(p => {
      const score = p.reviews[p.reviews.length - 1]?.totalMarks || 'N/A';
      return `"${p.id}","${p.title.replace(/"/g, '""')}","${p.category}","${p.department}","${p.studentName}","${p.studentRollNumber}","${p.advisorName}","${p.status}",v${p.currentVersion},"${score}","${p.createdAt}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Department_Project_Report_${selectedDept.replace(/\s+/g, '_')}_2025_26.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Department Head Portal
            </span>
            <span className="text-slate-300 text-xs">• {selectedDept}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {currentUser?.name || 'Dr. M. V. Krishnan (HOD - IT)'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl">
            Surveillance of mini-projects and major capstone tracks, advisor review velocity, compliance verification, and accreditation audits.
          </p>
        </div>

        {/* Action Buttons: Export Report */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={() => setShowPrintReport(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Accreditation Report
          </button>
        </div>
      </div>

      {/* Department Selector & KPI Cards */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-slate-700">Filter Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold text-slate-800 shadow-2xs"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing metrics for Academic Session: <strong>2025-2026</strong>
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Department Projects</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalProjects}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Mini & Major tracks</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Approved for Defense</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{approvedProjects}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{approvalRate}% completion rate</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Advisor Action</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-2">{pendingProjects}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">In evaluation queue</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Correction Cycle</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{correctionProjects}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Revisions in progress</p>
        </div>
      </div>

      {/* Advisor Workload & Velocity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-600" />
              Faculty Guide Workload & Review Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks projects supervised, clearance velocity, and pending reviews per faculty member
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Faculty Guide</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4 text-center">Supervised Projects</th>
                <th className="py-3 px-4 text-center">Approved</th>
                <th className="py-3 px-4 text-center">Pending Reviews</th>
                <th className="py-3 px-4 text-center">Clearance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptAdvisors.map((advisor) => {
                const advProjects = deptProjects.filter(p => p.advisorId === advisor.id);
                const advApproved = advProjects.filter(p => p.status === 'Approved').length;
                const advPending = advProjects.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
                const advRate = advProjects.length > 0 ? Math.round((advApproved / advProjects.length) * 100) : 0;

                return (
                  <tr key={advisor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={advisor.avatar}
                        alt={advisor.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span>{advisor.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {advisor.facultyId || 'FAC-GUIDE'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">Associate Professor</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{advProjects.length}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">{advApproved}</td>
                    <td className="py-3 px-4 text-center">
                      {advPending > 0 ? (
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {advPending} pending
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-600 h-full rounded-full" 
                            style={{ width: `${advRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700">{advRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Projects Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Department Projects Registry ({filteredProjects.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live inspection of candidate submissions across Information Technology
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Correction Required">Correction Required</option>
              <option value="Pending">Pending</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Student Lead</th>
                <th className="py-3 px-4">Guide</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((proj) => {
                const score = proj.reviews[proj.reviews.length - 1]?.totalMarks;
                return (
                  <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <p 
                        onClick={() => onSelectProject(proj.id)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate"
                      >
                        {proj.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">v{proj.currentVersion}.0 • {proj.documents.length} docs</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{proj.studentName}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{proj.studentRollNumber}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {proj.advisorName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={proj.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      {score ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {score}/100
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE ACCREDITATION REPORT MODAL */}
      {showPrintReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 no-print">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Official Departmental Project Assessment Dossier
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPrintReport(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0">
              <div className="text-center border-b-2 border-slate-800 pb-4">
                <h2 className="text-xl font-extrabold uppercase tracking-tight">
                  Apex Institute of Technology
                </h2>
                <h3 className="text-sm font-bold text-slate-700 uppercase">
                  Department of {selectedDept}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Academic Year 2025-2026 • Mini & Major Project Clearance Summary (NBA Criteria 2.2)
                </p>
              </div>

              {/* Summary Stats Table */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="border border-slate-300 p-2.5 rounded">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Total Enrolled</p>
                  <p className="text-base font-bold">{totalProjects}</p>
                </div>
                <div className="border border-slate-300 p-2.5 rounded">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Approved</p>
                  <p className="text-base font-bold text-emerald-700">{approvedProjects}</p>
                </div>
                <div className="border border-slate-300 p-2.5 rounded">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Pending Revisions</p>
                  <p className="text-base font-bold text-amber-700">{correctionProjects}</p>
                </div>
                <div className="border border-slate-300 p-2.5 rounded">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Pass Rate</p>
                  <p className="text-base font-bold text-blue-700">{approvalRate}%</p>
                </div>
              </div>

              {/* Detailed Table */}
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="p-2 border border-slate-300">S.No</th>
                    <th className="p-2 border border-slate-300">Project Title</th>
                    <th className="p-2 border border-slate-300">Candidate & Roll</th>
                    <th className="p-2 border border-slate-300">Faculty Guide</th>
                    <th className="p-2 border border-slate-300">Status</th>
                    <th className="p-2 border border-slate-300 text-center">Score / 100</th>
                  </tr>
                </thead>
                <tbody>
                  {deptProjects.map((p, idx) => (
                    <tr key={p.id} className="border-b border-slate-300">
                      <td className="p-2 border border-slate-300 font-mono">{idx + 1}</td>
                      <td className="p-2 border border-slate-300 font-semibold">{p.title}</td>
                      <td className="p-2 border border-slate-300">{p.studentName} ({p.studentRollNumber})</td>
                      <td className="p-2 border border-slate-300">{p.advisorName}</td>
                      <td className="p-2 border border-slate-300">{p.status}</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        {p.reviews[p.reviews.length - 1]?.totalMarks || 'In Progress'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-12 flex justify-between text-xs font-semibold text-slate-700">
                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1" />
                  <span>Project Coordinator</span>
                </div>
                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1" />
                  <span>Head of Department</span>
                </div>
                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1" />
                  <span>Principal / Dean Academics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
