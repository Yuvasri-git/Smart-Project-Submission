import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Project, ProjectCategory, TeamMember } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  PlusCircle, 
  FileText, 
  Github, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Users, 
  ExternalLink, 
  Trash2, 
  FileCheck, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

interface StudentDashboardProps {
  onSelectProject: (projectId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onSelectProject }) => {
  const { 
    currentUser, 
    projects, 
    users, 
    departments, 
    submitProject, 
    resubmitProject 
  } = usePortal();

  // Submission modal state
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [selectedProjectForResubmit, setSelectedProjectForResubmit] = useState<Project | null>(null);

  // New Project Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Major Project (Final Year)');
  const [department, setDepartment] = useState(currentUser?.department || 'Information Technology');
  const [abstract, setAbstract] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['React', 'Node.js', 'Python']);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  
  // Team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      name: currentUser?.name || 'Alex Rivera',
      rollNumber: currentUser?.rollNumber || '21IT042',
      email: currentUser?.email || 'alex.rivera@student.apex.edu',
      isLead: true,
    }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRoll, setNewMemberRoll] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Uploaded Files State
  const [uploadedFiles, setUploadedFiles] = useState<{
    name: string;
    size: string;
    fileType: 'pdf' | 'doc' | 'docx';
    url: string;
  }[]>([
    {
      name: 'Project_Synopsis_and_SRS.pdf',
      size: '2.4 MB',
      fileType: 'pdf',
      url: '#'
    }
  ]);
  const [uploadError, setUploadError] = useState('');

  // Resubmit Modal State
  const [changesSummary, setChangesSummary] = useState('');
  const [resubmitAbstract, setResubmitAbstract] = useState('');
  const [resubmitGithub, setResubmitGithub] = useState('');
  const [resubmitFiles, setResubmitFiles] = useState<{
    name: string;
    size: string;
    fileType: 'pdf' | 'doc' | 'docx';
    url: string;
  }[]>([]);

  // Find student's projects
  const myProjects = projects.filter(
    p => p.studentId === currentUser?.id || p.teamMembers.some(m => m.rollNumber === currentUser?.rollNumber)
  );

  // Find assigned advisor
  const advisor = users.find(u => u.id === currentUser?.assignedAdvisorId) || 
                  users.find(u => u.role === 'advisor');

  // Handle tech stack add
  const handleAddTech = () => {
    if (techStackInput.trim() && !techStack.includes(techStackInput.trim())) {
      setTechStack([...techStack, techStackInput.trim()]);
      setTechStackInput('');
    }
  };

  const handleRemoveTech = (item: string) => {
    setTechStack(techStack.filter(t => t !== item));
  };

  // Handle team member add
  const handleAddTeamMember = () => {
    if (!newMemberName.trim() || !newMemberRoll.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        name: newMemberName.trim(),
        rollNumber: newMemberRoll.trim(),
        email: newMemberEmail.trim() || `${newMemberRoll.toLowerCase()}@student.apex.edu`,
        isLead: false
      }
    ]);
    setNewMemberName('');
    setNewMemberRoll('');
    setNewMemberEmail('');
  };

  const handleRemoveTeamMember = (index: number) => {
    if (teamMembers[index].isLead) return; // Prevent removing team lead
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  // Handle file drop/upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && ext !== 'doc' && ext !== 'docx') {
        setUploadError(`Invalid file format: .${ext}. Only PDF, DOC, and DOCX files are allowed.`);
        return;
      }
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      setUploadedFiles(prev => [
        ...prev,
        {
          name: file.name,
          size: sizeMB,
          fileType: ext as any,
          url: '#'
        }
      ]);
    }
  };

  // Submit new project
  const handleSubmitNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim() || !githubUrl.trim()) {
      alert('Please fill out Project Title, Abstract, and GitHub Repository URL.');
      return;
    }

    const newProjectId = submitProject({
      title,
      category,
      department,
      abstract,
      techStack,
      teamMembers,
      githubUrl,
      liveDemoUrl,
      documents: uploadedFiles
    });

    setSubmitModalOpen(false);
    // Reset form
    setTitle('');
    setAbstract('');
    setGithubUrl('');
    setLiveDemoUrl('');
    onSelectProject(newProjectId);
  };

  // Resubmit Project
  const handleOpenResubmit = (proj: Project) => {
    setSelectedProjectForResubmit(proj);
    setChangesSummary('');
    setResubmitAbstract(proj.abstract);
    setResubmitGithub(proj.githubUrl);
    setResubmitFiles([
      {
        name: `${proj.title.slice(0, 15).replace(/\s+/g, '_')}_Revision_v${proj.currentVersion + 1}.pdf`,
        size: '3.6 MB',
        fileType: 'pdf',
        url: '#'
      }
    ]);
    setResubmitModalOpen(true);
  };

  const handleConfirmResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForResubmit || !changesSummary.trim()) {
      alert('Please explain the corrections made according to your advisor feedback.');
      return;
    }

    resubmitProject({
      projectId: selectedProjectForResubmit.id,
      changesSummary,
      abstract: resubmitAbstract,
      githubUrl: resubmitGithub,
      documents: resubmitFiles
    });

    setResubmitModalOpen(false);
    onSelectProject(selectedProjectForResubmit.id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Student Info & Assigned Guide */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Student Workspace
              </span>
              <span className="text-slate-300 text-xs">• Roll No: {currentUser?.rollNumber || '21IT042'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/90 max-w-2xl leading-relaxed">
              Track project milestones, submit new technical deliverables, view advisor evaluations, and upload revisions before semester deadlines.
            </p>
          </div>

          {/* Assigned Advisor Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:min-w-[280px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block mb-1">
              Assigned Faculty Guide
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/60 border border-white/30 flex items-center justify-center font-bold text-sm text-white">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {advisor?.name || 'Dr. S. K. Raman'}
                </p>
                <p className="text-[11px] text-blue-200">
                  {advisor?.department || 'Information Technology'}
                </p>
                <p className="text-[10px] text-slate-300 truncate font-mono">
                  {advisor?.email || 'raman@apex.edu'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Projects Section Header & Submit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            My Project Submissions ({myProjects.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mini projects and final-year capstone submissions associated with your student profile
          </p>
        </div>

        <button
          onClick={() => setSubmitModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Submit New Project
        </button>
      </div>

      {/* My Projects Cards */}
      {myProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-bold text-slate-800">No Projects Submitted Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You haven't submitted your mini project or final year project yet. Click the button below to upload your project documentation and GitHub repository.
          </p>
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Submit First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myProjects.map((project) => {
            const latestReview = project.reviews[project.reviews.length - 1];
            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category, Version & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {project.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                        v{project.currentVersion}.0
                      </span>
                    </div>
                    <StatusBadge status={project.status} size="sm" />
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectProject(project.id)}
                    className="text-base font-bold text-slate-900 leading-snug hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                  >
                    {project.title}
                  </h3>

                  {/* Abstract preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.abstract}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[11px] font-medium px-1.5 py-0.5 text-slate-400">
                        +{project.techStack.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Advisor & Date */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Guide: <strong className="text-slate-800">{project.advisorName}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {project.createdAt}
                    </span>
                  </div>

                  {/* Advisor Feedback Alert if Correction Required */}
                  {project.status === 'Correction Required' && latestReview && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Advisor Feedback:
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium">Action Required</span>
                      </div>
                      <p className="text-xs text-amber-900 italic line-clamp-2">
                        "{latestReview.feedback}"
                      </p>
                    </div>
                  )}

                  {/* Approved score banner */}
                  {project.status === 'Approved' && latestReview?.totalMarks && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Approved for Final Presentation
                      </span>
                      <span className="font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        Score: {latestReview.totalMarks} / 100
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Repo
                    </a>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      {project.documents.length} doc{project.documents.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.status === 'Correction Required' && (
                      <button
                        onClick={() => handleOpenResubmit(project)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Resubmit v{project.currentVersion + 1}
                      </button>
                    )}

                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* SUBMIT NEW PROJECT MODAL */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold tracking-tight">Submit New Project Proposal</h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Enter project metadata, team roster, GitHub repository, and upload project documents.
                </p>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitNewProject} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Project Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart IoT Microgrid Energy Balancer using Reinforcement Learning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>

              {/* Category & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  >
                    <option value="Mini Project">Mini Project (Sem 5/6)</option>
                    <option value="Major Project (Final Year)">Major Project (Final Year - Sem 7/8)</option>
                    <option value="Capstone Project">Capstone Project</option>
                    <option value="Research / Patent Project">Research / Patent Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Abstract */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Abstract & Scope * (Minimum 50 words)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe problem statement, literature gap, proposed methodology, and anticipated outputs..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed"
                />
              </div>

              {/* Tech Stack Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technologies / Frameworks Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. TensorFlow, Docker, React, MQTT..."
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200 flex items-center gap-1"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-rose-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub Repo & Live Demo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GitHub Repository URL *
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/project-repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Live Demo / Video Link (Optional)
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://my-project-demo.com"
                      value={liveDemoUrl}
                      onChange={(e) => setLiveDemoUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Team Members Roster */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600" />
                    Team Members ({teamMembers.length})
                  </label>
                  <span className="text-[11px] text-slate-500">Max 4 per batch</span>
                </div>

                {/* Team Members List */}
                <div className="space-y-1.5">
                  {teamMembers.map((member, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{member.name}</span>
                        <span className="text-slate-500 font-mono">({member.rollNumber})</span>
                        {member.isLead && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                            Team Lead
                          </span>
                        )}
                      </div>
                      {!member.isLead && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTeamMember(i)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Member Row */}
                {teamMembers.length < 4 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Teammate Name"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Roll No (e.g. 21IT048)"
                      value={newMemberRoll}
                      onChange={(e) => setNewMemberRoll(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddTeamMember}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    >
                      + Add Teammate
                    </button>
                  </div>
                )}
              </div>

              {/* File Upload Section (PDF, DOC, DOCX) */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Upload Project Documents (PDF, DOC, DOCX) *
                </label>

                {uploadError && (
                  <p className="text-xs text-rose-600 font-medium">{uploadError}</p>
                )}

                <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-5 text-center bg-slate-50/50 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drop project documents here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supported file extensions: .pdf, .doc, .docx (Max 25MB each)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    className="mt-3 block mx-auto text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                {/* Uploaded File List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Submit Project for Advisor Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* RESUBMIT REVISED VERSION MODAL */}
      {resubmitModalOpen && selectedProjectForResubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  Resubmit Revision v{selectedProjectForResubmit.currentVersion + 1}.0
                </h3>
                <p className="text-xs text-amber-100 mt-0.5 truncate max-w-lg">
                  {selectedProjectForResubmit.title}
                </p>
              </div>
              <button
                onClick={() => setResubmitModalOpen(false)}
                className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmResubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* Prior Advisor Feedback Reminder */}
              {selectedProjectForResubmit.reviews.length > 0 && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                  <span className="font-bold text-amber-900 block">
                    Advisor Instructions ({selectedProjectForResubmit.reviews[selectedProjectForResubmit.reviews.length - 1].advisorName}):
                  </span>
                  <p className="text-amber-800 italic">
                    "{selectedProjectForResubmit.reviews[selectedProjectForResubmit.reviews.length - 1].feedback}"
                  </p>
                </div>
              )}

              {/* Changes Summary Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Summary of Corrections & Changes Made *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the corrections addressed (e.g. Added emergency vehicle tests, revised Chapter 4 results, fixed gas estimation algorithm)..."
                  value={changesSummary}
                  onChange={(e) => setChangesSummary(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
                />
              </div>

              {/* Updated Documents */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Revised Report (PDF, DOC, DOCX) *
                </label>
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-slate-800">
                      {selectedProjectForResubmit.title.slice(0, 20)}_Revised_v{selectedProjectForResubmit.currentVersion + 1}.pdf
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">(4.2 MB)</span>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    Ready to attach
                  </span>
                </div>
              </div>

              {/* GitHub Link Check */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Repository URL (Confirm Latest Commit)
                </label>
                <input
                  type="url"
                  value={resubmitGithub}
                  onChange={(e) => setResubmitGithub(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md transition-colors"
                >
                  Confirm & Resubmit for Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
