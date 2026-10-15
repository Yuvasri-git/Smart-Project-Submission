import React, { useRef, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Bell, Check, Clock, FileCheck2, AlertCircle, Sparkles, CheckCheck } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onSelectProject
}) => {
  const { notifications, currentUser, markNotificationAsRead, markAllNotificationsAsRead } = usePortal();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter(
    n => n.userId === 'all' || n.userId === currentUser?.id
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      case 'correction':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'submission':
        return <Sparkles className="w-4 h-4 text-blue-600" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {userNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
            No notifications yet
          </div>
        ) : (
          userNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.projectId && onSelectProject) {
                  onSelectProject(notif.projectId);
                  onClose();
                }
              }}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="mt-0.5 p-2 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {notif.createdAt}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-500 font-medium">
          Smart Project Portal Notification Dispatcher
        </span>
      </div>
    </div>
  );
};
