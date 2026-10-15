import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  CalendarDays, 
  Clock, 
  Megaphone, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Building2,
  FileText
} from 'lucide-react';

export const DeadlinesCalendarView: React.FC = () => {
  const { deadlines, announcements } = usePortal();

  // Helper to calculate days remaining
  const getDaysRemaining = (dueDateStr: string) => {
    const today = new Date('2026-10-15'); // Fixed baseline or current
    const due = new Date(dueDateStr);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          Academic Deadlines & Institutional Circulars
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official timeline schedules for mini projects, major project chapters, code freeze, and external viva evaluations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Active Deadlines List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Upcoming Submission Milestones ({deadlines.length})
            </h2>
            <span className="text-[11px] text-slate-400">Strict adherence mandatory</span>
          </div>

          <div className="space-y-3">
            {deadlines.map((dl) => {
              const daysLeft = getDaysRemaining(dl.dueDate);
              const isUrgent = daysLeft <= 10;

              return (
                <div
                  key={dl.id}
                  className={`p-4 rounded-2xl border bg-white shadow-xs space-y-2.5 transition-all ${
                    isUrgent ? 'border-amber-300 ring-1 ring-amber-400/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {dl.category}
                      </span>
                      <span className="text-xs text-slate-400">• {dl.department}</span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        daysLeft > 0 
                          ? isUrgent 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline Passed'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {dl.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dl.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Due Date: <strong className="font-mono">{dl.dueDate}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400">AY: {dl.academicYear}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Circulars & Notice Board (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-600" />
              Campus Circulars & Guidelines
            </h2>
            <span className="text-[11px] text-slate-400">Official Notices</span>
          </div>

          <div className="space-y-3">
            {announcements.map((anc) => (
              <div
                key={anc.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    anc.priority === 'high' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                      : anc.priority === 'medium'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {anc.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-[10px] text-slate-400">{anc.createdAt}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {anc.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {anc.content}
                </p>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Issued by: <strong className="text-slate-600">{anc.postedBy}</strong></span>
                  <span>Dept: {anc.department}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Submission Tips */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 text-xs">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Submission Check-List for Students
            </h4>
            <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px] leading-relaxed">
              <li>Project document must include Problem Statement & SRS.</li>
              <li>GitHub repository must be set to Public with README.md.</li>
              <li>Plagiarism threshold is strictly 15% (IEEE standards).</li>
              <li>Both Team Lead and Members must be listed before review.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
