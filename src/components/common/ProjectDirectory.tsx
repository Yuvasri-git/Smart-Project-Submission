import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { StatusBadge } from './StatusBadge';
import { 
  Search, 
  Filter, 
  FolderGit2, 
  LayoutGrid, 
  List, 
  Github, 
  Calendar, 
  User, 
  ArrowRight, 
  Award, 
  FileText,
  RotateCcw
} from 'lucide-react';

interface ProjectDirectoryProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectDirectory: React.FC<ProjectDirectoryProps> = ({ onSelectProject }) => {
  const { 
    projects, 
    departments, 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter, 
    departmentFilter, 
    setDepartmentFilter, 
    categoryFilter, 
    setCategoryFilter 
  } = usePortal();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    // Status filter
    if (statusFilter !== 'all' && project.status !== statusFilter) return false;
    // Department filter
    if (departmentFilter !== 'all' && project.department !== departmentFilter) return false;
    // Category filter
    if (categoryFilter !== 'all' && project.category !== categoryFilter) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchStudent = project.studentName.toLowerCase().includes(q) || project.studentRollNumber.toLowerCase().includes(q);
      const matchAdvisor = project.advisorName.toLowerCase().includes(q);
      const matchDept = project.department.toLowerCase().includes(q);
      const matchTech = project.techStack.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchStudent && !matchAdvisor && !matchDept && !matchTech) {
        return false;
      }
    }

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDepartmentFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" />
            Project Archive & Submissions Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore engineering mini projects and final year capstone submissions across all academic departments
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, student, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Categories</option>
              <option value="Mini Project">Mini Project</option>
              <option value="Major Project (Final Year)">Major Project (Final Year)</option>
              <option value="Capstone Project">Capstone Project</option>
              <option value="Research / Patent Project">Research / Patent Project</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Correction Required">Correction Required</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Found <strong className="text-slate-800">{filteredProjects.length}</strong> matching projects
          </span>
          {(searchQuery || statusFilter !== 'all' || departmentFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Results */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs space-y-2">
          <FolderGit2 className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
          <p className="font-bold text-slate-700">No project submissions match your criteria</p>
          <p className="text-slate-400">Try modifying search keywords or clearing active filters.</p>
          <button
            onClick={resetFilters}
            className="mt-2 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {project.category}
                  </span>
                  <StatusBadge status={project.status} size="sm" />
                </div>

                <h3 
                  onClick={() => onSelectProject(project.id)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-2"
                >
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {project.abstract}
                </p>

                <div className="flex flex-wrap gap-1">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-[10px] text-slate-400 px-1 py-0.5">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate">Student: <strong className="text-slate-800">{project.studentName}</strong></span>
                    <span className="font-mono text-slate-400">{project.studentRollNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="truncate">Guide: {project.advisorName}</span>
                    <span className="text-slate-400">{project.department}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  v{project.currentVersion}.0 • {project.documents.length} doc{project.documents.length > 1 ? 's' : ''}
                </span>

                <button
                  onClick={() => onSelectProject(project.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                >
                  View Details
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">Guide</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 max-w-xs">
                    <span 
                      onClick={() => onSelectProject(p.id)}
                      className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate block"
                    >
                      {p.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">v{p.currentVersion}.0</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{p.category}</td>
                  <td className="py-3 px-3 text-slate-600">{p.department}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800">{p.studentName}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{p.studentRollNumber}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{p.advisorName}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
