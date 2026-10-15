import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  BookOpen, 
  CheckCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Sparkles,
  Building2,
  FileCheck2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchUserRole } = usePortal();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('alex.rivera@student.apex.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Demo accounts map
  const demoAccounts: Record<UserRole, { email: string; name: string; dept: string }> = {
    student: { email: 'alex.rivera@student.apex.edu', name: 'Alex Rivera (Roll: 21IT042)', dept: 'Information Technology' },
    advisor: { email: 'raman@apex.edu', name: 'Dr. S. K. Raman (Professor)', dept: 'Information Technology' },
    hod: { email: 'hod.it@apex.edu', name: 'Dr. M. V. Krishnan (HOD)', dept: 'Information Technology' },
    admin: { email: 'admin@apex.edu', name: 'Dr. A. V. Rangarajan (Dean)', dept: 'Academic Administration' },
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setEmail(demoAccounts[selectedRole].email);
    setPassword('password123');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(email, password, role);
      if (!success) {
        setErrorMessage('Invalid credentials. Please use the demo accounts or check your email.');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleQuickLogin = (quickRole: UserRole) => {
    switchUserRole(quickRole);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModalOpen(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Side: College Brand & Visual Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Background Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top College Header */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-7 h-7 text-blue-300" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200 block">
                  Apex Institute of Technology
                </span>
                <span className="text-lg font-extrabold tracking-tight text-white block">
                  Project Portal
                </span>
              </div>
            </div>

            <div className="pt-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Engineering Project Submission & Review System
              </h1>
              <p className="text-xs sm:text-sm text-blue-200/90 mt-2 leading-relaxed">
                A centralized academic repository facilitating online submissions of mini-projects, capstone, and major projects with multi-level approval workflows.
              </p>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="relative z-10 space-y-3 my-8">
            <div className="flex items-start gap-3 text-xs text-blue-100 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Version-controlled project documentation & GitHub validation</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-blue-100 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Multi-criteria rubric evaluations (Novelty, Code, Viva)</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-blue-100 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>HOD department surveillance & automated compliance export</span>
            </div>
          </div>

          {/* Bottom Accreditation Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200">
            <span>Autonomous Institution • NBA & NAAC A++</span>
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white font-bold">
              AY 2025-26
            </span>
          </div>

        </div>

        {/* Right Side: Role Selector & Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Sign in to your account
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your campus role to log in with dedicated permissions
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Live Demo Ready
              </span>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
              {[
                { r: 'student' as UserRole, label: 'Student', icon: BookOpen },
                { r: 'advisor' as UserRole, label: 'Advisor', icon: UserCheck },
                { r: 'hod' as UserRole, label: 'HOD', icon: Building2 },
                { r: 'admin' as UserRole, label: 'Admin', icon: ShieldCheck },
              ].map(({ r, label, icon: Icon }) => {
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
                    placeholder="e.g. name@student.apex.edu"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Account Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all font-mono"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-slate-300"
                  />
                  <span>Remember my institutional device</span>
                </label>
                <span className="text-[11px] text-slate-400">Default: password123</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : `Sign in as ${role.toUpperCase()}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Persona Login */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                <span>Quick Demo Access (1-Click Switch)</span>
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { r: 'student' as UserRole, title: 'Student', desc: 'Submit projects & docs' },
                  { r: 'advisor' as UserRole, title: 'Advisor', desc: 'Grade & request revisions' },
                  { r: 'hod' as UserRole, title: 'HOD', desc: 'Monitor branch progress' },
                  { r: 'admin' as UserRole, title: 'Admin', desc: 'Manage users & dates' },
                ].map((item) => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => handleQuickLogin(item.r)}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                        {item.title}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-4 text-center">
            <p className="text-[11px] text-slate-400">
              Need technical help? Contact <span className="text-slate-600 font-medium">it.support@apex.edu</span> or ERP Cell (Ext: 442)
            </p>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Reset Portal Password</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered college email. A password reset link and temporary passkey will be generated.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Reset Instructions Sent!
                </p>
                <p className="text-emerald-700">
                  Please check your inbox. For testing, your password remains <code className="font-mono font-bold">password123</code>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@student.apex.edu"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
