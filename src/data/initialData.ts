import { User, Project, Department, AcademicYear, Deadline, Announcement, NotificationItem } from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-it',
    name: 'Information Technology',
    code: 'IT',
    hodName: 'Dr. M. V. Krishnan',
    hodEmail: 'hod.it@apex.edu',
    totalStudents: 180,
    totalFaculty: 14,
  },
  {
    id: 'dept-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hodName: 'Dr. Sunita Rao',
    hodEmail: 'hod.cse@apex.edu',
    totalStudents: 240,
    totalFaculty: 18,
  },
  {
    id: 'dept-ece',
    name: 'Electronics & Communication',
    code: 'ECE',
    hodName: 'Dr. Rajesh Pillai',
    hodEmail: 'hod.ece@apex.edu',
    totalStudents: 150,
    totalFaculty: 12,
  },
  {
    id: 'dept-mech',
    name: 'Mechanical Engineering',
    code: 'MECH',
    hodName: 'Dr. K. Balachandran',
    hodEmail: 'hod.mech@apex.edu',
    totalStudents: 120,
    totalFaculty: 10,
  },
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-2024-25', year: '2024-2025', isCurrent: false, totalProjects: 86 },
  { id: 'ay-2025-26', year: '2025-2026', isCurrent: true, totalProjects: 114 },
  { id: 'ay-2026-27', year: '2026-2027', isCurrent: false, totalProjects: 0 },
];

export const INITIAL_USERS: User[] = [
  // Admin
  {
    id: 'user-admin-1',
    name: 'Dr. A. V. Rangarajan',
    email: 'admin@apex.edu',
    password: 'password123',
    role: 'admin',
    department: 'Administration',
    facultyId: 'FAC-ADM-01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 12345',
  },
  // HODs
  {
    id: 'user-hod-it',
    name: 'Dr. M. V. Krishnan',
    email: 'hod.it@apex.edu',
    password: 'password123',
    role: 'hod',
    department: 'Information Technology',
    facultyId: 'FAC-IT-001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 23456',
  },
  {
    id: 'user-hod-cse',
    name: 'Dr. Sunita Rao',
    email: 'hod.cse@apex.edu',
    password: 'password123',
    role: 'hod',
    department: 'Computer Science & Engineering',
    facultyId: 'FAC-CSE-001',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 34567',
  },
  // Advisors
  {
    id: 'user-adv-1',
    name: 'Dr. S. K. Raman',
    email: 'raman@apex.edu',
    password: 'password123',
    role: 'advisor',
    department: 'Information Technology',
    facultyId: 'FAC-IT-012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 45678',
  },
  {
    id: 'user-adv-2',
    name: 'Dr. Anita Roy',
    email: 'anita.roy@apex.edu',
    password: 'password123',
    role: 'advisor',
    department: 'Information Technology',
    facultyId: 'FAC-IT-018',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 56789',
  },
  {
    id: 'user-adv-3',
    name: 'Prof. Vikram Mehta',
    email: 'vikram@apex.edu',
    password: 'password123',
    role: 'advisor',
    department: 'Computer Science & Engineering',
    facultyId: 'FAC-CSE-025',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 67890',
  },
  // Students
  {
    id: 'user-stud-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.apex.edu',
    password: 'password123',
    role: 'student',
    department: 'Information Technology',
    rollNumber: '21IT042',
    academicYear: '2025-2026',
    semester: 'Semester 7',
    assignedAdvisorId: 'user-adv-1',
    assignedAdvisorName: 'Dr. S. K. Raman',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 78901',
  },
  {
    id: 'user-stud-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@student.apex.edu',
    password: 'password123',
    role: 'student',
    department: 'Information Technology',
    rollNumber: '21IT089',
    academicYear: '2025-2026',
    semester: 'Semester 7',
    assignedAdvisorId: 'user-adv-2',
    assignedAdvisorName: 'Dr. Anita Roy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 89012',
  },
  {
    id: 'user-stud-3',
    name: 'Rahul Nair',
    email: 'rahul.nair@student.apex.edu',
    password: 'password123',
    role: 'student',
    department: 'Electronics & Communication',
    rollNumber: '21EC015',
    academicYear: '2025-2026',
    semester: 'Semester 7',
    assignedAdvisorId: 'user-adv-1',
    assignedAdvisorName: 'Dr. S. K. Raman',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 90123',
  },
  {
    id: 'user-stud-4',
    name: 'Neha Gupta',
    email: 'neha.gupta@student.apex.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: '21CS054',
    academicYear: '2025-2026',
    semester: 'Semester 7',
    assignedAdvisorId: 'user-adv-3',
    assignedAdvisorName: 'Prof. Vikram Mehta',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 01234',
  },
  {
    id: 'user-stud-5',
    name: 'David Chen',
    email: 'david.chen@student.apex.edu',
    password: 'password123',
    role: 'student',
    department: 'Information Technology',
    rollNumber: '21IT102',
    academicYear: '2025-2026',
    semester: 'Semester 7',
    assignedAdvisorId: 'user-adv-1',
    assignedAdvisorName: 'Dr. S. K. Raman',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98450 11223',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'Smart City Traffic Optimization using Edge AI & Computer Vision',
    category: 'Major Project (Final Year)',
    department: 'Information Technology',
    academicYear: '2025-2026',
    studentId: 'user-stud-1',
    studentName: 'Alex Rivera',
    studentRollNumber: '21IT042',
    studentEmail: 'alex.rivera@student.apex.edu',
    advisorId: 'user-adv-1',
    advisorName: 'Dr. S. K. Raman',
    abstract: 'This project implements an intelligent traffic control mechanism employing YOLOv8 object detection on edge devices (Jetson Nano) to dynamically manipulate traffic light cycle times based on live vehicle density, emergency vehicle preemption, and carbon emissions estimation.',
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'MQTT', 'React', 'FastAPI'],
    teamMembers: [
      { name: 'Alex Rivera', rollNumber: '21IT042', email: 'alex.rivera@student.apex.edu', isLead: true },
      { name: 'Siddharth Varma', rollNumber: '21IT048', email: 'siddharth.v@student.apex.edu', isLead: false },
      { name: 'Kavya Menon', rollNumber: '21IT031', email: 'kavya.m@student.apex.edu', isLead: false }
    ],
    githubUrl: 'https://github.com/alexrivera/smart-traffic-edge-ai',
    liveDemoUrl: 'https://traffic-ai-demo.apex.edu',
    documents: [
      {
        id: 'doc-001',
        name: 'Smart_Traffic_Final_Report_v2.pdf',
        size: '4.8 MB',
        uploadedAt: '2026-10-10',
        fileType: 'pdf',
        url: '#'
      },
      {
        id: 'doc-002',
        name: 'System_Architecture_Diagram.docx',
        size: '1.2 MB',
        uploadedAt: '2026-10-10',
        fileType: 'docx',
        url: '#'
      }
    ],
    status: 'Approved',
    currentVersion: 2,
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-09-28',
        changesSummary: 'Initial project submission with preliminary literature survey and hardware block diagram.',
        documents: [{ id: 'doc-v1', name: 'Smart_Traffic_Draft_v1.pdf', size: '3.1 MB', uploadedAt: '2026-09-28', fileType: 'pdf', url: '#' }],
        githubUrl: 'https://github.com/alexrivera/smart-traffic-edge-ai',
        abstract: 'Initial draft on smart traffic control.'
      },
      {
        versionNumber: 2,
        submittedAt: '2026-10-10',
        changesSummary: 'Addressed advisor feedback: Included emergency vehicle priority algorithm benchmark, latency charts, and live video test metrics.',
        documents: [{ id: 'doc-001', name: 'Smart_Traffic_Final_Report_v2.pdf', size: '4.8 MB', uploadedAt: '2026-10-10', fileType: 'pdf', url: '#' }],
        githubUrl: 'https://github.com/alexrivera/smart-traffic-edge-ai',
        abstract: 'This project implements an intelligent traffic control mechanism employing YOLOv8 object detection on edge devices.'
      }
    ],
    reviews: [
      {
        id: 'rev-001',
        advisorId: 'user-adv-1',
        advisorName: 'Dr. S. K. Raman',
        status: 'Correction Required',
        feedback: 'Good implementation, but the report lacks emergency vehicle pre-emption validation. Please test with ambulance sirens or visual strobe markers and update the results chapter.',
        createdAt: '2026-10-02',
        rubricScores: { novelty: 22, implementation: 20, documentation: 16, presentation: 20 },
        totalMarks: 78
      },
      {
        id: 'rev-002',
        advisorId: 'user-adv-1',
        advisorName: 'Dr. S. K. Raman',
        status: 'Approved',
        feedback: 'Excellent updates. Emergency vehicle pre-emption tests and edge inference latency under 45ms are very impressive. Approved for final viva presentation.',
        createdAt: '2026-10-12',
        rubricScores: { novelty: 24, implementation: 24, documentation: 23, presentation: 24 },
        totalMarks: 95
      }
    ],
    createdAt: '2026-09-28',
    updatedAt: '2026-10-12'
  },
  {
    id: 'proj-002',
    title: 'Decentralized Healthcare Records with Zero-Knowledge Proofs & IPFS',
    category: 'Major Project (Final Year)',
    department: 'Information Technology',
    academicYear: '2025-2026',
    studentId: 'user-stud-2',
    studentName: 'Priya Sharma',
    studentRollNumber: '21IT089',
    studentEmail: 'priya.sharma@student.apex.edu',
    advisorId: 'user-adv-2',
    advisorName: 'Dr. Anita Roy',
    abstract: 'A privacy-preserving electronic health records (EHR) platform combining Ethereum smart contracts with IPFS decentralized storage and zk-SNARKs for patient consent verification without disclosing sensitive diagnostic data.',
    techStack: ['Solidity', 'IPFS', 'Next.js', 'circom', 'Ethers.js', 'Node.js'],
    teamMembers: [
      { name: 'Priya Sharma', rollNumber: '21IT089', email: 'priya.sharma@student.apex.edu', isLead: true },
      { name: 'Arjun Das', rollNumber: '21IT014', email: 'arjun.das@student.apex.edu', isLead: false }
    ],
    githubUrl: 'https://github.com/priyasharma-it/decentralized-ehr-zkp',
    documents: [
      {
        id: 'doc-003',
        name: 'EHR_Blockchain_Interim_Report.pdf',
        size: '5.2 MB',
        uploadedAt: '2026-10-08',
        fileType: 'pdf',
        url: '#'
      }
    ],
    status: 'Correction Required',
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-10-08',
        changesSummary: 'First draft submission with smart contract architecture and IPFS CID hashing schema.',
        documents: [{ id: 'doc-003', name: 'EHR_Blockchain_Interim_Report.pdf', size: '5.2 MB', uploadedAt: '2026-10-08', fileType: 'pdf', url: '#' }],
        githubUrl: 'https://github.com/priyasharma-it/decentralized-ehr-zkp',
        abstract: 'A privacy-preserving electronic health records (EHR) platform combining Ethereum smart contracts with IPFS decentralized storage.'
      }
    ],
    reviews: [
      {
        id: 'rev-003',
        advisorId: 'user-adv-2',
        advisorName: 'Dr. Anita Roy',
        status: 'Correction Required',
        feedback: 'The cryptographic proof flow is well articulated, but gas cost analysis for multiple medical record queries is missing. Also please add HIPAA compliance analysis in Chapter 4 before resubmitting.',
        createdAt: '2026-10-13',
        rubricScores: { novelty: 23, implementation: 19, documentation: 18, presentation: 20 },
        totalMarks: 80
      }
    ],
    createdAt: '2026-10-08',
    updatedAt: '2026-10-13'
  },
  {
    id: 'proj-003',
    title: 'Autonomous Agricultural Drone for Soil NPK and Crop Disease Detection',
    category: 'Mini Project',
    department: 'Electronics & Communication',
    academicYear: '2025-2026',
    studentId: 'user-stud-3',
    studentName: 'Rahul Nair',
    studentRollNumber: '21EC015',
    studentEmail: 'rahul.nair@student.apex.edu',
    advisorId: 'user-adv-1',
    advisorName: 'Dr. S. K. Raman',
    abstract: 'An autonomous multirotor drone carrying multispectral sensors and an embedded thermal camera to evaluate soil Nitrogen-Phosphorus-Potassium levels and detect leaf blight in rice plantations.',
    techStack: ['Raspberry Pi', 'Pixhawk', 'Python', 'OpenCV', 'TensorFlow Lite', 'LoRaWAN'],
    teamMembers: [
      { name: 'Rahul Nair', rollNumber: '21EC015', email: 'rahul.nair@student.apex.edu', isLead: true },
      { name: 'Deepak V', rollNumber: '21EC024', email: 'deepak.v@student.apex.edu', isLead: false }
    ],
    githubUrl: 'https://github.com/rahulnair/agri-drone-npk-vision',
    documents: [
      {
        id: 'doc-004',
        name: 'AgriDrone_MiniProject_Synopsis.pdf',
        size: '3.4 MB',
        uploadedAt: '2026-10-14',
        fileType: 'pdf',
        url: '#'
      }
    ],
    status: 'Under Review',
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-10-14',
        changesSummary: 'Initial mini project documentation with flight waypoint simulations and NDVI plant stress index equations.',
        documents: [{ id: 'doc-004', name: 'AgriDrone_MiniProject_Synopsis.pdf', size: '3.4 MB', uploadedAt: '2026-10-14', fileType: 'pdf', url: '#' }],
        githubUrl: 'https://github.com/rahulnair/agri-drone-npk-vision',
        abstract: 'An autonomous multirotor drone carrying multispectral sensors.'
      }
    ],
    reviews: [],
    createdAt: '2026-10-14',
    updatedAt: '2026-10-14'
  },
  {
    id: 'proj-004',
    title: 'Automated Classroom Attendance System via Anti-Spoofing Face Recognition',
    category: 'Mini Project',
    department: 'Computer Science & Engineering',
    academicYear: '2025-2026',
    studentId: 'user-stud-4',
    studentName: 'Neha Gupta',
    studentRollNumber: '21CS054',
    studentEmail: 'neha.gupta@student.apex.edu',
    advisorId: 'user-adv-3',
    advisorName: 'Prof. Vikram Mehta',
    abstract: 'A contact-free attendance tracking solution using Dual-Camera infrared depth mapping and InsightFace embeddings to mitigate 2D photograph spoofing, instantly generating ERP-compatible attendance spreadsheets.',
    techStack: ['Python', 'InsightFace', 'PyQt5', 'SQLite', 'Flask'],
    teamMembers: [
      { name: 'Neha Gupta', rollNumber: '21CS054', email: 'neha.gupta@student.apex.edu', isLead: true },
      { name: 'Aakash Verma', rollNumber: '21CS003', email: 'aakash.v@student.apex.edu', isLead: false }
    ],
    githubUrl: 'https://github.com/nehagupta/face-attendance-antispoof',
    documents: [
      {
        id: 'doc-005',
        name: 'FaceAttendance_SRS_Report.pdf',
        size: '2.9 MB',
        uploadedAt: '2026-10-15',
        fileType: 'pdf',
        url: '#'
      }
    ],
    status: 'Pending',
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-10-15',
        changesSummary: 'Fresh submission of mini project proposal.',
        documents: [{ id: 'doc-005', name: 'FaceAttendance_SRS_Report.pdf', size: '2.9 MB', uploadedAt: '2026-10-15', fileType: 'pdf', url: '#' }],
        githubUrl: 'https://github.com/nehagupta/face-attendance-antispoof',
        abstract: 'A contact-free attendance tracking solution using Dual-Camera infrared depth mapping.'
      }
    ],
    reviews: [],
    createdAt: '2026-10-15',
    updatedAt: '2026-10-15'
  },
  {
    id: 'proj-005',
    title: 'Predictive Kubernetes Auto-Scaler for High-Concurrency Microservices',
    category: 'Major Project (Final Year)',
    department: 'Information Technology',
    academicYear: '2025-2026',
    studentId: 'user-stud-5',
    studentName: 'David Chen',
    studentRollNumber: '21IT102',
    studentEmail: 'david.chen@student.apex.edu',
    advisorId: 'user-adv-1',
    advisorName: 'Dr. S. K. Raman',
    abstract: 'An intelligent Custom Resource Definition (CRD) controller for Kubernetes that leverages LSTM neural networks to forecast HTTP traffic bursts 15 minutes ahead, scaling pod replicas pro-actively rather than reactively.',
    techStack: ['Go', 'Kubernetes API', 'Prometheus', 'TensorFlow', 'Docker', 'Helm'],
    teamMembers: [
      { name: 'David Chen', rollNumber: '21IT102', email: 'david.chen@student.apex.edu', isLead: true },
      { name: 'Rohan Joshi', rollNumber: '21IT077', email: 'rohan.j@student.apex.edu', isLead: false }
    ],
    githubUrl: 'https://github.com/davidchen/k8s-predictive-scaler',
    documents: [
      {
        id: 'doc-006',
        name: 'K8s_Scaler_MajorProject_Complete.pdf',
        size: '6.1 MB',
        uploadedAt: '2026-10-11',
        fileType: 'pdf',
        url: '#'
      }
    ],
    status: 'Approved',
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        submittedAt: '2026-10-11',
        changesSummary: 'Full implementation and test results under synthetic load generators.',
        documents: [{ id: 'doc-006', name: 'K8s_Scaler_MajorProject_Complete.pdf', size: '6.1 MB', uploadedAt: '2026-10-11', fileType: 'pdf', url: '#' }],
        githubUrl: 'https://github.com/davidchen/k8s-predictive-scaler',
        abstract: 'An intelligent Custom Resource Definition (CRD) controller for Kubernetes.'
      }
    ],
    reviews: [
      {
        id: 'rev-004',
        advisorId: 'user-adv-1',
        advisorName: 'Dr. S. K. Raman',
        status: 'Approved',
        feedback: 'Outstanding technical depth, rigorous load benchmark against standard HPA (Horizontal Pod Autoscaler) with 34% reduction in SLA breaches. Project awarded Grade A+.',
        createdAt: '2026-10-14',
        rubricScores: { novelty: 25, implementation: 25, documentation: 24, presentation: 24 },
        totalMarks: 98
      }
    ],
    createdAt: '2026-10-11',
    updatedAt: '2026-10-14'
  }
];

export const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'dl-001',
    title: 'Phase-1 Mini Project Synopsis & Architecture Submission',
    category: 'Mini Project',
    department: 'Information Technology',
    dueDate: '2026-10-25',
    description: 'All 3rd Year IT students must submit their finalized problem statement, technology stack, and block diagram approved by project guides.',
    academicYear: '2025-2026',
    isActive: true,
  },
  {
    id: 'dl-002',
    title: 'Final Year Major Project Draft Documentation (Chapters 1-5)',
    category: 'Major Project (Final Year)',
    department: 'All Departments',
    dueDate: '2026-11-10',
    description: 'Submission of complete project report including methodology, implementation code snippets, and preliminary testing benchmarks.',
    academicYear: '2025-2026',
    isActive: true,
  },
  {
    id: 'dl-003',
    title: 'Capstone Project Code Freeze & GitHub Repository Audit',
    category: 'Capstone Project',
    department: 'Computer Science & Engineering',
    dueDate: '2026-11-20',
    description: 'Final commit hash must be submitted with full README, setup scripts, and test suite.',
    academicYear: '2025-2026',
    isActive: true,
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-001',
    title: 'IEEE Project Formatting Guidelines for 2025-2026',
    content: 'All project reports must strictly adhere to the standard IEEE two-column conference template or Apex Engineering College Thesis manual. Plagiarism threshold is strictly capped at 15%.',
    postedBy: 'Dean of Academics & Research',
    department: 'All',
    priority: 'high',
    createdAt: '2026-10-01',
  },
  {
    id: 'anc-002',
    title: 'Inter-College Project Exhibition & Innovation Expo',
    content: 'Top 3 projects from each department will be nominated for the National Tech Innovation Conclave with cash prizes up to INR 1,00,000. Ensure demo video links are added to your repository.',
    postedBy: 'Dr. M. V. Krishnan (HOD - IT)',
    department: 'Information Technology',
    priority: 'medium',
    createdAt: '2026-10-05',
  },
  {
    id: 'anc-003',
    title: 'Hardware Lab Access & Cloud Server Credits',
    content: 'Students requiring Jetson boards, Raspberry Pi 5, or AWS Cloud credits for deep learning projects can collect access vouchers from the IT lab coordinator.',
    postedBy: 'Dr. Anita Roy',
    department: 'Information Technology',
    priority: 'low',
    createdAt: '2026-10-12',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-stud-1',
    title: 'Project Approved!',
    message: 'Dr. S. K. Raman approved your final version for Smart City Traffic Optimization with 95/100 marks.',
    type: 'approval',
    read: false,
    createdAt: '2026-10-12',
    projectId: 'proj-001',
  },
  {
    id: 'notif-2',
    userId: 'user-stud-2',
    title: 'Corrections Required',
    message: 'Dr. Anita Roy requested revisions on Decentralized Healthcare Records: Add HIPAA compliance and gas metrics.',
    type: 'correction',
    read: false,
    createdAt: '2026-10-13',
    projectId: 'proj-002',
  },
  {
    id: 'notif-3',
    userId: 'user-adv-1',
    title: 'New Mini Project Submitted',
    message: 'Rahul Nair submitted "Autonomous Agricultural Drone for Soil NPK" for review.',
    type: 'submission',
    read: false,
    createdAt: '2026-10-14',
    projectId: 'proj-003',
  },
  {
    id: 'notif-4',
    userId: 'all',
    title: 'Upcoming Deadline Alert',
    message: 'Phase-1 Mini Project Synopsis submission closes in 10 days (25th Oct 2026).',
    type: 'deadline',
    read: true,
    createdAt: '2026-10-15',
  }
];
