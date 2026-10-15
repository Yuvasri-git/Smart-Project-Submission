import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../types';
import { usePortal } from '../../context/PortalContext';
import { 
  X, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  FileText, 
  Github, 
  Send,
  Sparkles
} from 'lucide-react';

interface ReviewModalProps {
  project: Project | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  project,
  onClose,
  onSuccess
}) => {
  const { reviewProject } = usePortal();

  const [status, setStatus] = useState<ProjectStatus>(
    project?.status === 'Approved' ? 'Approved' : 'Approved'
  );
  const [feedback, setFeedback] = useState(
    project?.reviews[project.reviews.length - 1]?.feedback || ''
  );

  // Rubric scores (default to realistic 22/25 each)
  const [novelty, setNovelty] = useState<number>(23);
  const [implementation, setImplementation] = useState<number>(22);
  const [documentation, setDocumentation] = useState<number>(20);
  const [presentation, setPresentation] = useState<number>(21);

  if (!project) return null;

  const totalScore = novelty + implementation + documentation + presentation;

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'Grade O (Outstanding)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { grade: 'Grade A+ (Excellent)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 70) return { grade: 'Grade A (Very Good)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (score >= 60) return { grade: 'Grade B+ (Satisfactory)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { grade: 'Grade B (Revisions Recommended)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const gradeInfo = getGrade(totalScore);

  const quickSnippets = [
    'Outstanding implementation and well-documented architecture. Approved for final viva.',
    'Please address experimental validation and include comparative graphs before resubmitting.',
    'Source code quality is high; however, update Chapter 4 to detail hardware pinouts.',
    'System design is acceptable. Resubmit report with proper IEEE formatting references.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert('Please provide review comments / recommendations for the student.');
      return;
    }

    reviewProject({
      projectId: project.id,
      status,
      feedback,
      rubricScores: {
        novelty,
        implementation,
        documentation,
        presentation
      }
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-200">
                Evaluation Rubric
              </span>
              <span className="text-xs text-slate-300">• v{project.currentVersion}.0</span>
            </div>
            <h3 className="text-base font-bold tracking-tight mt-1 line-clamp-1">
              Review: {project.title}
            </h3>
            <p className="text-xs text-blue-200">
              Student: {project.studentName} ({project.studentRollNumber})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluation Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Decision Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Evaluation Decision *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Approved')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Approve Project</span>
                <span className="text-[10px] font-normal text-emerald-600">Cleared for Viva</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('Correction Required')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  status === 'Correction Required'
                    ? 'bg-amber-50 text-amber-800 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Request Corrections</span>
                <span className="text-[10px] font-normal text-amber-600">Revisions needed</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('Rejected')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  status === 'Rejected'
                    ? 'bg-rose-50 text-rose-800 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Reject Submission</span>
                <span className="text-[10px] font-normal text-rose-600">Unsatisfactory</span>
              </button>
            </div>
          </div>

          {/* Rubric Criteria with Sliders */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                Rubric Marks Breakdown (Max: 100)
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${gradeInfo.color}`}>
                Total: {totalScore}/100 • {gradeInfo.grade}
              </span>
            </div>

            {/* Slider 1: Novelty */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>1. Problem Novelty & Literature Survey</span>
                <span className="font-mono text-blue-600">{novelty} / 25</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={novelty}
                onChange={(e) => setNovelty(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 2: Implementation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>2. Implementation & Code Quality</span>
                <span className="font-mono text-blue-600">{implementation} / 25</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={implementation}
                onChange={(e) => setImplementation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 3: Documentation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>3. Documentation & SRS Compliance</span>
                <span className="font-mono text-blue-600">{documentation} / 25</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={documentation}
                onChange={(e) => setDocumentation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 4: Presentation */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>4. Viva Voce & Technical Defense</span>
                <span className="font-mono text-blue-600">{presentation} / 25</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={presentation}
                onChange={(e) => setPresentation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Feedback & Comments */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Advisor Feedback & Specific Guidance *
              </label>
              <span className="text-[11px] text-slate-400">Sent to student</span>
            </div>
            <textarea
              rows={4}
              required
              placeholder="Detail specific remarks, experimental improvements, or reasons for revision..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed"
            />
          </div>

          {/* Preset Quick Remarks */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick Remarks Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickSnippets.map((snip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFeedback(snip)}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-colors text-left"
                >
                  "{snip.slice(0, 40)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Save Evaluation & Notify Student
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
