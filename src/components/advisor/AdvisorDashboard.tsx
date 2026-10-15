import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award, 
  FileText, 
  Github, 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  Sliders, 
  BookOpen, 
  Calendar,
  Send,
  XCircle,
  Sparkles
} from 'lucide-react';

interface AdvisorDashboardProps {
  onSelectProject: (projectId: string) => void;
  onOpenReviewModal: (project: Project) => void;
}

export const AdvisorDashboard: React.FC<AdvisorDashboardProps> = ({
  onSelectProject,
  onOpenReviewModal,
}) => {
  const { currentUser, projects, users, deadlines } = usePortal();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'corrections' | 'approved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects assigned to this advisor
  const advisorProjects = projects.filter(
    p => p.advisorId === currentUser?.id || currentUser?.role === 'admin' || currentUser?.role === 'hod'
  );

  // Quick stats
  const totalAssigned = advisorProjects.length;
  const pendingCount = advisorProjects.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
  const correctionCount = advisorProjects.filter(p => p.status === 'Correction Required').length;
  const approvedCount = advisorProjects.filter(p => p.status === 'Approved').length;

  // Filtered projects
  const filteredProjects = advisorProjects.filter(p => {
    // Tab filter
    if (activeFilter === 'pending' && !(p.status === 'Pending' || p.status === 'Under Review')) return false;
    if (activeFilter === 'corrections' && p.status !== 'Correction Required') return false;
    if (activeFilter === 'approved' && p.status !== 'Approved') return false;

    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = p.title.toLowerCase().includes(term);
      const matchesStudent = p.studentName.toLowerCase().includes(term) || p.studentRollNumber.toLowerCase().includes(term);
      const matchesTech = p.techStack.some(t => t.toLowerCase().includes(term));
      if (!matchesTitle && !matchesStudent && !matchesTech) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Advisor Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Faculty Guide Dashboard
            </span>
            <span className="text-slate-300 text-xs">• ID: {currentUser?.facultyId || 'FAC-IT-012'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {currentUser?.name || 'Dr. S. K. Raman'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-2xl">
            Review student project deliverables, inspect code repositories, assess rubric criteria, and provide guidance for semester evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
            <p className="text-xs text-blue-200 font-medium">Pending Reviews</p>
            <p className="text-lg font-bold text-amber-400">{pendingCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
            <p className="text-xs text-blue-200 font-medium">Approved</p>
            <p className="text-lg font-bold text-emerald-400">{approvedCount}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveFilter('all')}
          className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all ${
            activeFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assigned Projects</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalAssigned}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total candidate teams</p>
        </div>

        <div 
          onClick={() => setActiveFilter('pending')}
          className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all ${
            activeFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Needs Review</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Pending evaluation</p>
        </div>

        <div 
          onClick={() => setActiveFilter('corrections')}
          className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all ${
            activeFilter === 'corrections' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Corrections Requested</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{correctionCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting student fixes</p>
        </div>

        <div 
          onClick={() => setActiveFilter('approved')}
          className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all ${
            activeFilter === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Approved for Viva</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{approvedCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Cleared for final defense</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: `All (${totalAssigned})` },
            { id: 'pending', label: `Pending Review (${pendingCount})` },
            { id: 'corrections', label: `Corrections (${correctionCount})` },
            { id: 'approved', label: `Approved (${approvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
          />
        </div>
      </div>

      {/* Projects List Table & Cards */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No projects found matching the selected filter.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const latestReview = project.reviews[project.reviews.length - 1];
            const isPendingReview = project.status === 'Pending' || project.status === 'Under Review';

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                        v{project.currentVersion}.0
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Student: <strong className="text-slate-800">{project.studentName}</strong> ({project.studentRollNumber})
                      </span>
                    </div>

                    <h3 
                      onClick={() => onSelectProject(project.id)}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {project.abstract}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                    <StatusBadge status={project.status} size="md" />
                    <span className="text-[11px] text-slate-400 font-mono">
                      Sub: {project.createdAt}
                    </span>
                  </div>
                </div>

                {/* Team Members & Tech Stack preview */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Team: {project.teamMembers.map(m => m.name.split(' ')[0]).join(', ')}
                    </span>
                    <span className="text-slate-300">|</span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Github className="w-3.5 h-3.5" />
                      GitHub Repo
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  {latestReview?.totalMarks && (
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Evaluated Score: {latestReview.totalMarks} / 100
                    </span>
                  )}
                </div>

                {/* Latest Review Feedback Snippet */}
                {latestReview && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 mr-1.5">Last Remarks:</span>
                    <span className="italic">"{latestReview.feedback}"</span>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Details & Docs ({project.documents.length})
                  </button>

                  <button
                    onClick={() => onOpenReviewModal(project)}
                    className={`px-4 py-2 text-xs font-bold text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPendingReview
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    {isPendingReview ? 'Evaluate / Grade Submission' : 'Update Review / Rubric'}
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
