import React from 'react';
import { ProjectStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Search } from 'lucide-react';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size];

  switch (status) {
    case 'Approved':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs ${sizeClasses}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          Approved
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-xs ${sizeClasses}`}>
          {showIcon && <Search className="w-3.5 h-3.5 text-blue-600" />}
          Under Review
        </span>
      );
    case 'Correction Required':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-xs ${sizeClasses}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
          Correction Required
        </span>
      );
    case 'Pending':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-300 shadow-xs ${sizeClasses}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-slate-500" />}
          Pending
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs ${sizeClasses}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
          Rejected
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
