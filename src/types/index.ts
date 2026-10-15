export type UserRole = 'admin' | 'hod' | 'advisor' | 'student';

export type ProjectStatus = 'Pending' | 'Under Review' | 'Approved' | 'Correction Required' | 'Rejected';

export type ProjectCategory = 'Mini Project' | 'Major Project (Final Year)' | 'Capstone Project' | 'Research / Patent Project';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  avatar: string;
  phone?: string;
  rollNumber?: string; // For students
  facultyId?: string; // For faculty / HOD / advisor
  academicYear?: string; // For students (e.g., "2023-2027")
  semester?: string; // e.g. "Semester 6" or "Semester 8"
  assignedAdvisorId?: string; // For students
  assignedAdvisorName?: string;
}

export interface TeamMember {
  name: string;
  rollNumber: string;
  email: string;
  isLead?: boolean;
}

export interface SubmissionDocument {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  fileType: 'pdf' | 'doc' | 'docx';
  url: string;
}

export interface SubmissionReview {
  id: string;
  advisorId: string;
  advisorName: string;
  status: ProjectStatus;
  feedback: string;
  createdAt: string;
  rubricScores?: {
    novelty: number; // 0-25
    implementation: number; // 0-25
    documentation: number; // 0-25
    presentation: number; // 0-25
  };
  totalMarks?: number; // 0-100
}

export interface ProjectVersion {
  versionNumber: number;
  submittedAt: string;
  changesSummary?: string;
  documents: SubmissionDocument[];
  githubUrl: string;
  liveDemoUrl?: string;
  abstract: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  department: string;
  academicYear: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  studentEmail: string;
  advisorId: string;
  advisorName: string;
  abstract: string;
  techStack: string[];
  teamMembers: TeamMember[];
  githubUrl: string;
  liveDemoUrl?: string;
  documents: SubmissionDocument[];
  status: ProjectStatus;
  currentVersion: number;
  versions: ProjectVersion[];
  reviews: SubmissionReview[];
  createdAt: string;
  updatedAt: string;
  deadlineId?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  hodEmail: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface AcademicYear {
  id: string;
  year: string; // e.g. "2025-2026"
  isCurrent: boolean;
  totalProjects: number;
}

export interface Deadline {
  id: string;
  title: string;
  category: ProjectCategory;
  department: string;
  dueDate: string;
  description: string;
  academicYear: string;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  department: string; // "All" or department name
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // specific user or "all"
  title: string;
  message: string;
  type: 'submission' | 'feedback' | 'approval' | 'correction' | 'deadline' | 'announcement';
  read: boolean;
  createdAt: string;
  projectId?: string;
}
