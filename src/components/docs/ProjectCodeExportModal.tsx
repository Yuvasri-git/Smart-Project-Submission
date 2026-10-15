import React, { useState } from 'react';
import { 
  SQL_SCHEMA_CONTENT, 
  PHP_DB_CONNECT_CODE, 
  PHP_AUTH_LOGIN_CODE, 
  PHP_SUBMIT_PROJECT_CODE, 
  README_SETUP_GUIDE 
} from '../../data/projectDeliverables';
import { 
  X, 
  Database, 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Terminal, 
  Server, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ProjectCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectCodeExportModal: React.FC<ProjectCodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'php' | 'setup' | 'viva'>('sql');
  const [phpFile, setPhpFile] = useState<'db' | 'login' | 'submit'>('db');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getActiveCode = () => {
    if (activeTab === 'sql') return SQL_SCHEMA_CONTENT;
    if (activeTab === 'setup') return README_SETUP_GUIDE;
    if (activeTab === 'php') {
      if (phpFile === 'db') return PHP_DB_CONNECT_CODE;
      if (phpFile === 'login') return PHP_AUTH_LOGIN_CODE;
      return PHP_SUBMIT_PROJECT_CODE;
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                B.Tech IT Project Deliverables
              </span>
              <span className="text-xs text-slate-300">• PHP 8.1+ & MySQL 8.0</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Smart Project Submission Portal — Source Code & Database Bundle
            </h2>
            <p className="text-xs text-indigo-200">
              Download the complete database SQL dump, PHP API controllers, and Apache/XAMPP deployment guide.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
          <div className="flex gap-4">
            {[
              { id: 'sql', label: 'database.sql (MySQL Schema)', icon: Database },
              { id: 'php', label: 'PHP Backend Controllers', icon: FileCode2 },
              { id: 'setup', label: 'XAMPP / WAMP Setup Guide', icon: Terminal },
              { id: 'viva', label: 'Viva Voce Examination Q&A', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab !== 'viva' && (
            <div className="flex items-center gap-2 py-2 shrink-0">
              <button
                onClick={() => handleCopy(getActiveCode())}
                className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>

              <button
                onClick={() => {
                  if (activeTab === 'sql') {
                    handleDownload(SQL_SCHEMA_CONTENT, 'database.sql', 'application/sql');
                  } else if (activeTab === 'setup') {
                    handleDownload(README_SETUP_GUIDE, 'README_SETUP.md', 'text/markdown');
                  } else {
                    const code = getActiveCode();
                    const fname = phpFile === 'db' ? 'db.php' : phpFile === 'login' ? 'login.php' : 'submit_project.php';
                    handleDownload(code, fname, 'application/x-php');
                  }
                }}
                className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download File
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-200">
          
          {/* TAB 1: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-indigo-300 font-sans flex items-center justify-between">
                <span>MySQL 8.0+ / MariaDB Database Dump with 11 normalized tables and foreign keys.</span>
                <span className="font-mono text-emerald-400">Status: Verified & Syntax Checked</span>
              </div>
              <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto text-[11px] leading-relaxed text-emerald-300/90 border border-slate-800 selection:bg-indigo-800">
                {SQL_SCHEMA_CONTENT}
              </pre>
            </div>
          )}

          {/* TAB 2: PHP BACKEND */}
          {activeTab === 'php' && (
            <div className="space-y-4">
              <div className="flex gap-2 font-sans">
                {[
                  { id: 'db', label: 'config/db.php (PDO Connection)' },
                  { id: 'login', label: 'api/login.php (Role-based Auth)' },
                  { id: 'submit', label: 'api/submit_project.php (Uploads & Ver.)' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setPhpFile(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      phpFile === f.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <pre className="p-4 bg-slate-900 rounded-xl overflow-x-auto text-[11px] leading-relaxed text-indigo-200 border border-slate-800">
                {phpFile === 'db' && PHP_DB_CONNECT_CODE}
                {phpFile === 'login' && PHP_AUTH_LOGIN_CODE}
                {phpFile === 'submit' && PHP_SUBMIT_PROJECT_CODE}
              </pre>
            </div>
          )}

          {/* TAB 3: SETUP GUIDE */}
          {activeTab === 'setup' && (
            <div className="space-y-3 font-sans">
              <pre className="p-5 bg-slate-900 rounded-xl overflow-x-auto text-xs leading-relaxed text-slate-300 border border-slate-800 font-mono whitespace-pre-wrap">
                {README_SETUP_GUIDE}
              </pre>
            </div>
          )}

          {/* TAB 4: VIVA VOCE QUESTIONS */}
          {activeTab === 'viva' && (
            <div className="space-y-4 font-sans text-xs text-slate-200">
              <div className="p-4 bg-indigo-950/70 rounded-xl border border-indigo-800/50">
                <h4 className="font-bold text-sm text-indigo-300">
                  Top Mini-Project Viva Voce Questions & Model Answers
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Prepared for external examiner review in B.Tech Information Technology & CSE.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <p className="font-bold text-indigo-400">Q1: How does role-based access control (RBAC) prevent unauthorized privilege escalation?</p>
                  <p className="text-slate-300 leading-relaxed">
                    A: Every request evaluates the authenticated user's session role (Admin, HOD, Advisor, Student). For instance, students cannot execute review endpoints or modify other students' projects. Advisors can only evaluate students assigned to their departmental jurisdiction.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <p className="font-bold text-indigo-400">Q2: How are uploaded documents validated against malicious file execution?</p>
                  <p className="text-slate-300 leading-relaxed">
                    A: The system implements three levels of security: (1) Whitelist validation of extensions (.pdf, .doc, .docx only); (2) MIME-type verification using PHP finfo; (3) Storing files with randomly generated sanitized unique prefixes (e.g. `doc_65f...`) outside executable directories.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <p className="font-bold text-indigo-400">Q3: How does the system handle revision tracking and versioning?</p>
                  <p className="text-slate-300 leading-relaxed">
                    A: When an advisor requests corrections, the project is flagged as 'Correction Required'. The student uploads an incremental revision (v1 → v2) with a changelog summary. The previous versions and documents remain immutable in the `project_versions` table for historical auditability.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <p className="font-bold text-indigo-400">Q4: How does this portal assist in NBA / NAAC college accreditation?</p>
                  <p className="text-slate-300 leading-relaxed">
                    A: Criteria 2.2 of NBA requires clear documentation of student project evaluations with structured rubrics (Novelty, Implementation, Documentation, Viva). The HOD dashboard generates automated CSV and printable dossier reports detailing pass rates, advisor workload, and rubric distributions.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Apex Institute of Technology • Department of Information Technology</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
