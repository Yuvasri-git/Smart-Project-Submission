import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Project, 
  Department, 
  AcademicYear, 
  Deadline, 
  Announcement, 
  NotificationItem, 
  ProjectStatus, 
  ProjectCategory,
  SubmissionReview,
  TeamMember,
  SubmissionDocument
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_DEPARTMENTS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_DEADLINES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

interface SubmitProjectPayload {
  title: string;
  category: ProjectCategory;
  department: string;
  abstract: string;
  techStack: string[];
  teamMembers: TeamMember[];
  githubUrl: string;
  liveDemoUrl?: string;
  documents: { name: string; size: string; fileType: 'pdf' | 'doc' | 'docx'; url: string }[];
}

interface ResubmitProjectPayload {
  projectId: string;
  changesSummary: string;
  abstract?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  documents: { name: string; size: string; fileType: 'pdf' | 'doc' | 'docx'; url: string }[];
}

interface ReviewProjectPayload {
  projectId: string;
  status: ProjectStatus;
  feedback: string;
  rubricScores?: {
    novelty: number;
    implementation: number;
    documentation: number;
    presentation: number;
  };
}

interface PortalContextType {
  currentUser: User | null;
  users: User[];
  departments: Department[];
  academicYears: AcademicYear[];
  projects: Project[];
  deadlines: Deadline[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  
  // Navigation / Views
  currentView: string;
  setCurrentView: (view: string) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (d: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;

  // Auth
  login: (email: string, password?: string, roleOverride?: UserRole) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  updateCurrentUserProfile: (updatedData: Partial<User>) => void;

  // Project Actions
  submitProject: (payload: SubmitProjectPayload) => string;
  resubmitProject: (payload: ResubmitProjectPayload) => void;
  reviewProject: (payload: ReviewProjectPayload) => void;
  deleteProject: (id: string) => void;

  // Admin Actions
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  assignAdvisorToStudent: (studentId: string, advisorId: string) => void;
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  addDeadline: (dl: Omit<Deadline, 'id'>) => void;
  toggleDeadline: (id: string) => void;
  addAnnouncement: (anc: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // System
  resetAllData: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'smart_portal_current_user',
  USERS: 'smart_portal_users',
  PROJECTS: 'smart_portal_projects',
  DEPARTMENTS: 'smart_portal_departments',
  ACADEMIC_YEARS: 'smart_portal_academic_years',
  DEADLINES: 'smart_portal_deadlines',
  ANNOUNCEMENTS: 'smart_portal_announcements',
  NOTIFICATIONS: 'smart_portal_notifications',
};

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallbacks
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) return JSON.parse(saved);
    // Default to the first student for intuitive initial exploration
    return INITIAL_USERS.find(u => u.role === 'student') || INITIAL_USERS[0];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACADEMIC_YEARS);
    return saved ? JSON.parse(saved) : INITIAL_ACADEMIC_YEARS;
  });

  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEADLINES);
    return saved ? JSON.parse(saved) : INITIAL_DEADLINES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // UI state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_YEARS, JSON.stringify(academicYears));
  }, [academicYears]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEADLINES, JSON.stringify(deadlines));
  }, [deadlines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Auth Methods
  const login = (email: string, _password?: string, roleOverride?: UserRole): boolean => {
    let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser && roleOverride) {
      matchedUser = users.find(u => u.role === roleOverride);
    }
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setCurrentView('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    const userWithRole = users.find(u => u.role === role);
    if (userWithRole) {
      setCurrentUser(userWithRole);
      setCurrentView('dashboard');
    }
  };

  const updateCurrentUserProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  // Student Project Submission
  const submitProject = (payload: SubmitProjectPayload): string => {
    if (!currentUser) return '';
    const newId = `proj-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];

    const advisor = users.find(u => u.id === currentUser.assignedAdvisorId) || 
                    users.find(u => u.role === 'advisor') || {
                      id: 'user-adv-1',
                      name: 'Dr. S. K. Raman'
                    };

    const newDocs: SubmissionDocument[] = payload.documents.map((d, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: d.name,
      size: d.size,
      uploadedAt: today,
      fileType: d.fileType,
      url: d.url
    }));

    const newProject: Project = {
      id: newId,
      title: payload.title,
      category: payload.category,
      department: payload.department,
      academicYear: currentUser.academicYear || '2025-2026',
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRollNumber: currentUser.rollNumber || '21IT000',
      studentEmail: currentUser.email,
      advisorId: advisor.id,
      advisorName: advisor.name,
      abstract: payload.abstract,
      techStack: payload.techStack,
      teamMembers: payload.teamMembers,
      githubUrl: payload.githubUrl,
      liveDemoUrl: payload.liveDemoUrl,
      documents: newDocs,
      status: 'Pending',
      currentVersion: 1,
      versions: [
        {
          versionNumber: 1,
          submittedAt: today,
          changesSummary: 'Initial project proposal submission',
          documents: newDocs,
          githubUrl: payload.githubUrl,
          liveDemoUrl: payload.liveDemoUrl,
          abstract: payload.abstract
        }
      ],
      reviews: [],
      createdAt: today,
      updatedAt: today
    };

    setProjects(prev => [newProject, ...prev]);

    // Send notification to advisor
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: advisor.id,
      title: 'New Project Submission',
      message: `${currentUser.name} (${currentUser.rollNumber}) submitted "${payload.title}" for review.`,
      type: 'submission',
      read: false,
      createdAt: today,
      projectId: newId
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newId;
  };

  // Student Resubmission (Correction Flow)
  const resubmitProject = (payload: ResubmitProjectPayload) => {
    const today = new Date().toISOString().split('T')[0];
    
    setProjects(prev => prev.map(p => {
      if (p.id !== payload.projectId) return p;

      const nextVersionNumber = p.currentVersion + 1;
      const newDocs: SubmissionDocument[] = payload.documents.length > 0
        ? payload.documents.map((d, index) => ({
            id: `doc-${Date.now()}-${index}`,
            name: d.name,
            size: d.size,
            uploadedAt: today,
            fileType: d.fileType,
            url: d.url
          }))
        : p.documents;

      const newVersion = {
        versionNumber: nextVersionNumber,
        submittedAt: today,
        changesSummary: payload.changesSummary,
        documents: newDocs,
        githubUrl: payload.githubUrl || p.githubUrl,
        liveDemoUrl: payload.liveDemoUrl || p.liveDemoUrl,
        abstract: payload.abstract || p.abstract
      };

      return {
        ...p,
        abstract: payload.abstract || p.abstract,
        githubUrl: payload.githubUrl || p.githubUrl,
        liveDemoUrl: payload.liveDemoUrl || p.liveDemoUrl,
        documents: newDocs,
        currentVersion: nextVersionNumber,
        versions: [...p.versions, newVersion],
        status: 'Under Review' as ProjectStatus,
        updatedAt: today
      };
    }));

    // Find the project to notify its advisor
    const targetProject = projects.find(p => p.id === payload.projectId);
    if (targetProject) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: targetProject.advisorId,
        title: 'Project Resubmitted',
        message: `${targetProject.studentName} uploaded Revision v${targetProject.currentVersion + 1} for "${targetProject.title}".`,
        type: 'submission',
        read: false,
        createdAt: today,
        projectId: payload.projectId
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Advisor Review Project
  const reviewProject = (payload: ReviewProjectPayload) => {
    const today = new Date().toISOString().split('T')[0];
    const totalMarks = payload.rubricScores
      ? (payload.rubricScores.novelty + payload.rubricScores.implementation + payload.rubricScores.documentation + payload.rubricScores.presentation)
      : undefined;

    const newReview: SubmissionReview = {
      id: `rev-${Date.now()}`,
      advisorId: currentUser?.id || 'user-adv-1',
      advisorName: currentUser?.name || 'Faculty Advisor',
      status: payload.status,
      feedback: payload.feedback,
      createdAt: today,
      rubricScores: payload.rubricScores,
      totalMarks
    };

    setProjects(prev => prev.map(p => {
      if (p.id !== payload.projectId) return p;
      return {
        ...p,
        status: payload.status,
        reviews: [...p.reviews, newReview],
        updatedAt: today
      };
    }));

    // Notify student
    const targetProject = projects.find(p => p.id === payload.projectId);
    if (targetProject) {
      let notifType: NotificationItem['type'] = 'feedback';
      let notifTitle = 'Feedback Received';

      if (payload.status === 'Approved') {
        notifType = 'approval';
        notifTitle = 'Project Approved!';
      } else if (payload.status === 'Correction Required') {
        notifType = 'correction';
        notifTitle = 'Corrections Requested';
      }

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: targetProject.studentId,
        title: notifTitle,
        message: `${currentUser?.name} marked your project as "${payload.status}": ${payload.feedback.slice(0, 70)}...`,
        type: notifType,
        read: false,
        createdAt: today,
        projectId: payload.projectId
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Admin Actions
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const assignAdvisorToStudent = (studentId: string, advisorId: string) => {
    const advisor = users.find(u => u.id === advisorId);
    if (!advisor) return;

    setUsers(prev => prev.map(u => {
      if (u.id === studentId) {
        return {
          ...u,
          assignedAdvisorId: advisor.id,
          assignedAdvisorName: advisor.name
        };
      }
      return u;
    }));

    // Also update any active projects of this student
    setProjects(prev => prev.map(p => {
      if (p.studentId === studentId) {
        return {
          ...p,
          advisorId: advisor.id,
          advisorName: advisor.name
        };
      }
      return p;
    }));
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      ...dept
    };
    setDepartments(prev => [...prev, newDept]);
  };

  const addDeadline = (dl: Omit<Deadline, 'id'>) => {
    const newDl: Deadline = {
      id: `dl-${Date.now()}`,
      ...dl
    };
    setDeadlines(prev => [newDl, ...prev]);

    // Broadcast notification to students
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      title: 'New Deadline Announced',
      message: `${dl.title} is scheduled for ${dl.dueDate}.`,
      type: 'deadline',
      read: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const toggleDeadline = (id: string) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const addAnnouncement = (anc: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnc: Announcement = {
      id: `anc-${Date.now()}`,
      ...anc,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnc, ...prev]);

    // Notify all
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      title: 'Portal Announcement',
      message: anc.title,
      type: 'announcement',
      read: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset to seed data
  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setProjects(INITIAL_PROJECTS);
    setDepartments(INITIAL_DEPARTMENTS);
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setDeadlines(INITIAL_DEADLINES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS.find(u => u.role === 'student') || INITIAL_USERS[0]);
    setCurrentView('dashboard');
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        users,
        departments,
        academicYears,
        projects,
        deadlines,
        announcements,
        notifications,

        currentView,
        setCurrentView,

        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        departmentFilter,
        setDepartmentFilter,
        categoryFilter,
        setCategoryFilter,

        login,
        logout,
        switchUserRole,
        updateCurrentUserProfile,

        submitProject,
        resubmitProject,
        reviewProject,
        deleteProject,

        addUser,
        updateUser,
        deleteUser,
        assignAdvisorToStudent,
        addDepartment,
        addDeadline,
        toggleDeadline,
        addAnnouncement,
        deleteAnnouncement,

        markNotificationAsRead,
        markAllNotificationsAsRead,

        resetAllData
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
