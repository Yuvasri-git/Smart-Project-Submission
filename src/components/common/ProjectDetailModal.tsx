import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import { usePortal } from '../../context/PortalContext';
import { StatusBadge } from './StatusBadge';
import { 
  X, 
  ExternalLink, 
  Github, 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Award, 
  Layers, 
  History, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck,
  Code
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenReviewModal?: (project: Project) => void;
  onOpenResubmitModal?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenReviewModal,
  onOpenResubmitModal,
}) => {
  const { currentUser } = usePortal();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'documents' | 'reviews' | 'versions'>('overview');
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  if (!project) return null;

  const isAuthor = currentUser?.id === project.studentId;
  const isAssignedAdvisor = currentUser?.id === project.advisorId;
  const canReview = isAssignedAdvisor || currentUser?.role === 'advisor' || currentUser?.role === 'admin' || currentUser?.role === 'hod';
  const canResubmit = (isAuthor || currentUser?.role === 'student') && project.status === 'Correction Required';

  const downloadSimulatedFile = (fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob([
      `SMART PROJECT SUBMISSION PORTAL - DOCUMENT EXPORT
--------------------------------------------------
Project Title: ${project.title}
Category: ${project.category}
Student: ${project.studentName} (${project.studentRollNumber})
Department: ${project.department}
Academic Year: ${project.academicYear}
Advisor: ${project.advisorName}
Current Status: ${project.status}
Version: v${project.currentVersion}

ABSTRACT:
${project.abstract}

TECH STACK:
${project.techStack.join(', ')}

TEAM MEMBERS:
${project.teamMembers.map(m => `- ${m.name} (${m.rollNumber}) [${m.email}]`).join('\n')}

GITHUB REPOSITORY:
${project.githubUrl}
`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName.replace(/\.pdf|\.docx|\.doc/g, '') + '_Summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {project.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-300">
                • {project.department}
              </span>
              <span className="text-[11px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-white">
                v{project.currentVersion}.0
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-snug">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Submitted by: <strong className="text-white">{project.studentName}</strong> ({project.studentRollNumber})
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Advisor: <strong className="text-white">{project.advisorName}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Evaluation Status:</span>
            <StatusBadge status={project.status} size="md" />
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Created: {project.createdAt}
            </span>
            <span>•</span>
            <span>Last Updated: {project.updatedAt}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 px-6 bg-white shrink-0 flex gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Abstract & Overview', icon: FileText },
            { id: 'team', label: 'Team & Tech Stack', icon: Layers },
            { id: 'documents', label: `Documents (${project.documents.length})`, icon: Download },
            { id: 'reviews', label: `Reviews (${project.reviews.length})`, icon: MessageSquare },
            { id: 'versions', label: `Revisions (${project.versions.length})`, icon: History },
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

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Project Abstract & Problem Statement
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-normal">
                  {project.abstract}
                </p>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1">
                    <Github className="w-4 h-4 text-slate-800" />
                    GitHub Source Repository
                  </div>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 truncate font-mono"
                  >
                    {project.githubUrl}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {project.liveDemoUrl ? (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1">
                      <Code className="w-4 h-4 text-emerald-600" />
                      Live Deployment / Prototype
                    </div>
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-600 hover:underline flex items-center gap-1 truncate font-mono"
                    >
                      {project.liveDemoUrl}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center text-xs text-slate-400">
                    No live demo URL configured for this phase
                  </div>
                )}
              </div>

              {/* Latest Review Banner if any */}
              {project.reviews.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Latest Evaluation from {project.reviews[project.reviews.length - 1].advisorName}
                    </span>
                    {project.reviews[project.reviews.length - 1].totalMarks !== undefined && (
                      <span className="text-xs font-bold bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        Score: {project.reviews[project.reviews.length - 1].totalMarks} / 100
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 italic">
                    "{project.reviews[project.reviews.length - 1].feedback}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TEAM & TECH STACK */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Project Team Members ({project.teamMembers.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.teamMembers.map((member, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{member.name}</p>
                          {member.isLead && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                              Team Lead
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Roll: {member.rollNumber}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Uploaded Project Reports & Presentations
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  Allowed formats: .PDF, .DOC, .DOCX
                </span>
              </div>

              {project.documents.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No documents attached yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                  {project.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                          doc.fileType === 'pdf' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {doc.size} • Uploaded on {doc.uploadedAt} • Format: {doc.fileType.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setPreviewDoc(doc.name)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview
                        </button>
                        <button
                          onClick={() => downloadSimulatedFile(doc.name)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Document Preview Box if user clicked preview */}
              {previewDoc && (
                <div className="mt-4 p-5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-blue-400 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-400" />
                      Document Viewer: {previewDoc}
                    </span>
                    <button
                      onClick={() => setPreviewDoc(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Close Viewer
                    </button>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
                    <p className="text-emerald-400 font-bold">--- APEX ENGINEERING COLLEGE PROJECT REPOSITORY ---</p>
                    <p>PROJECT TITLE: {project.title}</p>
                    <p>CANDIDATE: {project.studentName} [{project.studentRollNumber}]</p>
                    <p>DEPARTMENT: {project.department} | CATEGORY: {project.category}</p>
                    <p>ADVISOR SIGN-OFF: {project.advisorName}</p>
                    <p className="text-slate-400 pt-2 border-t border-slate-800">
                      CHAPTER 1: Introduction & Problem Formulation<br/>
                      CHAPTER 2: Literature Review & Gap Analysis<br/>
                      CHAPTER 3: Proposed System Architecture & UML Schematics<br/>
                      CHAPTER 4: Implementation Results & Latency Benchmarks<br/>
                      CHAPTER 5: Conclusion & Future Scope
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS & RUBRICS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Faculty Review Logs & Evaluation Rubric
                </h4>
                {canReview && onOpenReviewModal && (
                  <button
                    onClick={() => {
                      onOpenReviewModal(project);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    Grade / Submit Review
                  </button>
                )}
              </div>

              {project.reviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No evaluation recorded yet. The faculty advisor will review the submitted deliverables.
                </div>
              ) : (
                <div className="space-y-3">
                  {project.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{rev.advisorName}</span>
                          <span className="text-[11px] text-slate-400">on {rev.createdAt}</span>
                        </div>
                        <StatusBadge status={rev.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                        {rev.feedback}
                      </p>

                      {rev.rubricScores && (
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Rubric Breakdown (Max: 100 Marks)
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-[10px] text-slate-500">Novelty</p>
                              <p className="text-xs font-bold text-slate-800">{rev.rubricScores.novelty} / 25</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-[10px] text-slate-500">Implementation</p>
                              <p className="text-xs font-bold text-slate-800">{rev.rubricScores.implementation} / 25</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-[10px] text-slate-500">Documentation</p>
                              <p className="text-xs font-bold text-slate-800">{rev.rubricScores.documentation} / 25</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-[10px] text-slate-500">Presentation</p>
                              <p className="text-xs font-bold text-slate-800">{rev.rubricScores.presentation} / 25</p>
                            </div>
                          </div>
                          <div className="mt-2 text-right">
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                              Total Score: {rev.totalMarks} / 100
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: VERSIONS & CHANGELOG */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Revision History & Resubmission Log
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {project.versions.map((ver) => (
                  <div key={ver.versionNumber} className="relative group">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          Version {ver.versionNumber}.0
                        </span>
                        <span className="text-[10px] text-slate-400">{ver.submittedAt}</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {ver.changesSummary || 'Regular submission draft.'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        GitHub Snapshot: {ver.githubUrl}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Project ID: <span className="font-mono">{project.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {canResubmit && onOpenResubmitModal && (
              <button
                onClick={() => {
                  onOpenResubmitModal(project);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Resubmit Corrected Draft
              </button>
            )}

            {canReview && onOpenReviewModal && (
              <button
                onClick={() => {
                  onOpenReviewModal(project);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                Evaluate / Grade
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
