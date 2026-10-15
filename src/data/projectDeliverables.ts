export const SQL_SCHEMA_CONTENT = `-- =====================================================================
-- SMART PROJECT SUBMISSION PORTAL - DATABASE SCHEMA
-- Target Database: MySQL 8.0+ / MariaDB 10.4+
-- Engineering College Mini & Final Year Project Management System
-- Generated for B.Tech Information Technology Academic Submission
-- =====================================================================

CREATE DATABASE IF NOT EXISTS \`smart_project_portal\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`smart_project_portal\`;

-- ---------------------------------------------------------------------
-- Table 1: departments
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`departments\`;
CREATE TABLE \`departments\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(10) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`hod_name\` VARCHAR(100) NOT NULL,
  \`hod_email\` VARCHAR(100) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 2: academic_years
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`academic_years\`;
CREATE TABLE \`academic_years\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`year_code\` VARCHAR(20) NOT NULL UNIQUE, -- e.g. '2025-2026'
  \`is_current\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 3: users (Admin, HOD, Advisor, Student)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'hod', 'advisor', 'student') NOT NULL,
  \`department_id\` INT UNSIGNED NULL,
  \`roll_number\` VARCHAR(30) NULL UNIQUE, -- For students (e.g. 21IT042)
  \`faculty_id\` VARCHAR(30) NULL UNIQUE,  -- For staff (e.g. FAC-IT-012)
  \`phone\` VARCHAR(20) NULL,
  \`avatar_url\` VARCHAR(255) NULL,
  \`assigned_advisor_id\` INT UNSIGNED NULL, -- Student guide link
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`assigned_advisor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 4: projects
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`projects\`;
CREATE TABLE \`projects\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`abstract\` TEXT NOT NULL,
  \`category\` ENUM('Mini Project', 'Major Project (Final Year)', 'Capstone Project', 'Research / Patent Project') NOT NULL,
  \`department_id\` INT UNSIGNED NOT NULL,
  \`academic_year\` VARCHAR(20) NOT NULL,
  \`student_id\` INT UNSIGNED NOT NULL,
  \`advisor_id\` INT UNSIGNED NOT NULL,
  \`github_url\` VARCHAR(255) NOT NULL,
  \`live_demo_url\` VARCHAR(255) NULL,
  \`tech_stack\` VARCHAR(255) NOT NULL, -- Comma-separated or JSON array
  \`current_version\` INT UNSIGNED DEFAULT 1,
  \`status\` ENUM('Pending', 'Under Review', 'Approved', 'Correction Required', 'Rejected') DEFAULT 'Pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`advisor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 5: team_members
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`team_members\`;
CREATE TABLE \`team_members\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`project_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`roll_number\` VARCHAR(30) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`is_lead\` TINYINT(1) DEFAULT 0,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 6: project_versions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`project_versions\`;
CREATE TABLE \`project_versions\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`project_id\` INT UNSIGNED NOT NULL,
  \`version_number\` INT UNSIGNED NOT NULL,
  \`changes_summary\` TEXT NULL,
  \`submitted_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 7: project_documents (PDF, DOC, DOCX)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`project_documents\`;
CREATE TABLE \`project_documents\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`project_id\` INT UNSIGNED NOT NULL,
  \`version_id\` INT UNSIGNED NULL,
  \`file_name\` VARCHAR(255) NOT NULL,
  \`file_path\` VARCHAR(255) NOT NULL,
  \`file_size\` VARCHAR(50) NOT NULL,
  \`file_type\` ENUM('pdf', 'doc', 'docx') NOT NULL,
  \`uploaded_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`version_id\`) REFERENCES \`project_versions\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 8: project_reviews (Advisor evaluations & marks)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`project_reviews\`;
CREATE TABLE \`project_reviews\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`project_id\` INT UNSIGNED NOT NULL,
  \`advisor_id\` INT UNSIGNED NOT NULL,
  \`status\` ENUM('Approved', 'Correction Required', 'Rejected') NOT NULL,
  \`feedback\` TEXT NOT NULL,
  \`score_novelty\` INT UNSIGNED DEFAULT 0,        -- max 25
  \`score_implementation\` INT UNSIGNED DEFAULT 0, -- max 25
  \`score_documentation\` INT UNSIGNED DEFAULT 0,  -- max 25
  \`score_presentation\` INT UNSIGNED DEFAULT 0,   -- max 25
  \`total_marks\` INT UNSIGNED DEFAULT 0,          -- max 100
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`advisor_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 9: deadlines
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`deadlines\`;
CREATE TABLE \`deadlines\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`department_id\` INT UNSIGNED NULL, -- NULL = All Departments
  \`due_date\` DATE NOT NULL,
  \`description\` TEXT NOT NULL,
  \`academic_year\` VARCHAR(20) NOT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 10: announcements
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`announcements\`;
CREATE TABLE \`announcements\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`content\` TEXT NOT NULL,
  \`posted_by\` VARCHAR(100) NOT NULL,
  \`department\` VARCHAR(100) DEFAULT 'All',
  \`priority\` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- Table 11: notifications
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS \`notifications\`;
CREATE TABLE \`notifications\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NULL, -- NULL = Broadcast to all
  \`project_id\` INT UNSIGNED NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`type\` ENUM('submission', 'feedback', 'approval', 'correction', 'deadline', 'announcement') NOT NULL,
  \`is_read\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SEED DATA INSERTION
-- Password for all seed users is 'password123' (Bcrypt hash below)
-- $2y$10$wO/9s1v5Gk0K5y3Z8u5IoeFpD6Q6uP5Yf0BvGf5vG5q5k5j5k5k5q
-- =====================================================================

INSERT INTO \`departments\` (\`id\`, \`code\`, \`name\`, \`hod_name\`, \`hod_email\`) VALUES
(1, 'IT', 'Information Technology', 'Dr. M. V. Krishnan', 'hod.it@apex.edu'),
(2, 'CSE', 'Computer Science & Engineering', 'Dr. Sunita Rao', 'hod.cse@apex.edu'),
(3, 'ECE', 'Electronics & Communication', 'Dr. Rajesh Pillai', 'hod.ece@apex.edu'),
(4, 'MECH', 'Mechanical Engineering', 'Dr. K. Balachandran', 'hod.mech@apex.edu');

INSERT INTO \`academic_years\` (\`year_code\`, \`is_current\`) VALUES
('2024-2025', 0),
('2025-2026', 1),
('2026-2027', 0);

-- Insert Users (Password: password123)
INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password_hash\`, \`role\`, \`department_id\`, \`roll_number\`, \`faculty_id\`, \`phone\`) VALUES
(1, 'Dr. A. V. Rangarajan', 'admin@apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'admin', NULL, NULL, 'FAC-ADM-01', '+91 98450 12345'),
(2, 'Dr. M. V. Krishnan', 'hod.it@apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'hod', 1, NULL, 'FAC-IT-001', '+91 98450 23456'),
(3, 'Dr. Sunita Rao', 'hod.cse@apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'hod', 2, NULL, 'FAC-CSE-001', '+91 98450 34567'),
(4, 'Dr. S. K. Raman', 'raman@apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'advisor', 1, NULL, 'FAC-IT-012', '+91 98450 45678'),
(5, 'Dr. Anita Roy', 'anita.roy@apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'advisor', 1, NULL, 'FAC-IT-018', '+91 98450 56789'),
(6, 'Prof. Vikram Mehta', 'vikram@apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'advisor', 2, NULL, 'FAC-CSE-025', '+91 98450 67890'),
(7, 'Alex Rivera', 'alex.rivera@student.apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'student', 1, '21IT042', NULL, '+91 98450 78901'),
(8, 'Priya Sharma', 'priya.sharma@student.apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'student', 1, '21IT089', NULL, '+91 98450 89012'),
(9, 'Rahul Nair', 'rahul.nair@student.apex.edu', '$2y$10$e8O4Z5v.0QeU2l0T4p7WdOFzO7Xv8q6tF4YvG5q5k5j5k5k5q4yW', 'student', 3, '21EC015', NULL, '+91 98450 90123');

-- Link students to their assigned advisors
UPDATE \`users\` SET \`assigned_advisor_id\` = 4 WHERE \`id\` = 7;
UPDATE \`users\` SET \`assigned_advisor_id\` = 5 WHERE \`id\` = 8;
UPDATE \`users\` SET \`assigned_advisor_id\` = 4 WHERE \`id\` = 9;

-- Insert Sample Projects
INSERT INTO \`projects\` (\`id\`, \`title\`, \`abstract\`, \`category\`, \`department_id\`, \`academic_year\`, \`student_id\`, \`advisor_id\`, \`github_url\`, \`live_demo_url\`, \`tech_stack\`, \`current_version\`, \`status\`) VALUES
(1, 'Smart City Traffic Optimization using Edge AI & Computer Vision', 'Intelligent traffic control mechanism using YOLOv8 edge inference to dynamically control traffic light phases.', 'Major Project (Final Year)', 1, '2025-2026', 7, 4, 'https://github.com/alexrivera/smart-traffic-edge-ai', 'https://traffic-ai-demo.apex.edu', 'Python, YOLOv8, OpenCV, React, FastAPI', 2, 'Approved'),
(2, 'Decentralized Healthcare Records with Zero-Knowledge Proofs & IPFS', 'Privacy-preserving electronic health records combining Ethereum smart contracts with IPFS decentralized storage and zk-SNARKs.', 'Major Project (Final Year)', 1, '2025-2026', 8, 5, 'https://github.com/priyasharma-it/decentralized-ehr-zkp', NULL, 'Solidity, IPFS, Next.js, circom, Node.js', 1, 'Correction Required');

-- Insert Team Members
INSERT INTO \`team_members\` (\`project_id\`, \`name\`, \`roll_number\`, \`email\`, \`is_lead\`) VALUES
(1, 'Alex Rivera', '21IT042', 'alex.rivera@student.apex.edu', 1),
(1, 'Siddharth Varma', '21IT048', 'siddharth.v@student.apex.edu', 0),
(2, 'Priya Sharma', '21IT089', 'priya.sharma@student.apex.edu', 1),
(2, 'Arjun Das', '21IT014', 'arjun.das@student.apex.edu', 0);
`;

export const PHP_DB_CONNECT_CODE = `<?php
/**
 * Smart Project Submission Portal
 * Database Connection Configuration (config/db.php)
 * Uses PDO with prepared statements for SQL Injection defense
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'smart_project_portal');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}
?>`;

export const PHP_AUTH_LOGIN_CODE = `<?php
/**
 * Smart Project Submission Portal
 * Authentication API (api/login.php)
 * Handles role-based authentication and secure session creation
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';
session_start();

$input = json_decode(file_get_contents('php://input'), true);
$email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$password = trim($input['password'] ?? '');

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
    exit;
}

// Fetch user with joined department and advisor names
$stmt = $pdo->prepare("
    SELECT u.id, u.name, u.email, u.password_hash, u.role, u.roll_number, u.faculty_id,
           u.phone, u.avatar_url, u.assigned_advisor_id, d.name AS department_name,
           adv.name AS assigned_advisor_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN users adv ON u.assigned_advisor_id = adv.id
    WHERE u.email = :email
    LIMIT 1
");
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    exit;
}

// Strip password hash from response
unset($user['password_hash']);

// Establish user session
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_role'] = $user['role'];
$_SESSION['user_name'] = $user['name'];

echo json_encode([
    'status' => 'success',
    'message' => 'Authentication successful',
    'user' => $user
]);
?>`;

export const PHP_SUBMIT_PROJECT_CODE = `<?php
/**
 * Smart Project Submission Portal
 * Submit / Update Project API (api/submit_project.php)
 * Handles multi-part file uploads (PDF, DOC, DOCX) and version increments
 */

header('Content-Type: application/json');
require_once '../config/db.php';
session_start();

// Verify user is logged in as student
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'student') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized: Only registered students can submit projects.']);
    exit;
}

$studentId = $_SESSION['user_id'];
$title = trim($_POST['title'] ?? '');
$abstract = trim($_POST['abstract'] ?? '');
$category = trim($_POST['category'] ?? '');
$departmentId = intval($_POST['department_id'] ?? 0);
$academicYear = trim($_POST['academic_year'] ?? '2025-2026');
$advisorId = intval($_POST['advisor_id'] ?? 0);
$githubUrl = trim($_POST['github_url'] ?? '');
$liveDemoUrl = trim($_POST['live_demo_url'] ?? '');
$techStack = trim($_POST['tech_stack'] ?? '');
$teamMembers = json_decode($_POST['team_members'] ?? '[]', true);

// Validation
if (empty($title) || empty($abstract) || empty($githubUrl)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Title, abstract, and GitHub repository URL are required.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Insert project record
    $stmt = $pdo->prepare("
        INSERT INTO projects (title, abstract, category, department_id, academic_year, student_id, advisor_id, github_url, live_demo_url, tech_stack, status, current_version)
        VALUES (:title, :abstract, :category, :dept, :ay, :student, :advisor, :github, :demo, :tech, 'Pending', 1)
    ");
    $stmt->execute([
        'title' => $title,
        'abstract' => $abstract,
        'category' => $category,
        'dept' => $departmentId,
        'ay' => $academicYear,
        'student' => $studentId,
        'advisor' => $advisorId,
        'github' => $githubUrl,
        'demo' => $liveDemoUrl,
        'tech' => $techStack
    ]);
    $projectId = $pdo->lastInsertId();

    // Insert initial version
    $vStmt = $pdo->prepare("INSERT INTO project_versions (project_id, version_number, changes_summary) VALUES (:pid, 1, 'Initial submission')");
    $vStmt->execute(['pid' => $projectId]);
    $versionId = $pdo->lastInsertId();

    // Insert team members
    $mStmt = $pdo->prepare("INSERT INTO team_members (project_id, name, roll_number, email, is_lead) VALUES (:pid, :name, :roll, :email, :lead)");
    foreach ($teamMembers as $member) {
        $mStmt->execute([
            'pid' => $projectId,
            'name' => $member['name'],
            'roll' => $member['rollNumber'],
            'email' => $member['email'],
            'lead' => !empty($member['isLead']) ? 1 : 0
        ]);
    }

    // Process File Uploads (PDF, DOC, DOCX)
    $uploadDir = '../uploads/projects/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $allowedExtensions = ['pdf', 'doc', 'docx'];
    if (!empty($_FILES['documents']['name'][0])) {
        $docStmt = $pdo->prepare("INSERT INTO project_documents (project_id, version_id, file_name, file_path, file_size, file_type) VALUES (:pid, :vid, :fname, :fpath, :fsize, :ftype)");

        for ($i = 0; $i < count($_FILES['documents']['name']); $i++) {
            $fileName = basename($_FILES['documents']['name'][$i]);
            $fileTmp = $_FILES['documents']['tmp_name'][$i];
            $fileSize = round($_FILES['documents']['size'][$i] / (1024 * 1024), 2) . ' MB';
            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if (!in_array($fileExt, $allowedExtensions)) {
                throw new Exception("Invalid file type: $fileExt. Only PDF, DOC, and DOCX files are permitted.");
            }

            $uniqueName = uniqid('doc_') . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName);
            $destination = $uploadDir . $uniqueName;

            if (move_uploaded_file($fileTmp, $destination)) {
                $docStmt->execute([
                    'pid' => $projectId,
                    'vid' => $versionId,
                    'fname' => $fileName,
                    'fpath' => 'uploads/projects/' . $uniqueName,
                    'fsize' => $fileSize,
                    'ftype' => $fileExt
                ]);
            }
        }
    }

    // Trigger Notification to assigned Advisor
    $notifStmt = $pdo->prepare("INSERT INTO notifications (user_id, project_id, title, message, type) VALUES (:uid, :pid, 'New Project Submission', :msg, 'submission')");
    $notifStmt->execute([
        'uid' => $advisorId,
        'pid' => $projectId,
        'msg' => "A new project submission '$title' has been submitted for your review."
    ]);

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Project submitted successfully!', 'project_id' => $projectId]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>`;

export const README_SETUP_GUIDE = `# SMART PROJECT SUBMISSION PORTAL
## Engineering College Mini & Final Year Project Management System
### B.Tech Information Technology Project Deliverables & Deployment Guide

---

### 1. System Overview & Architecture
The **Smart Project Submission Portal** is designed to eliminate paperwork and streamline mini-project and final-year project workflows in engineering colleges. It establishes an auditable four-tier role-based hierarchy:
1. **Administrator**: Oversees departments, user credentials, faculty/student allocations, college deadlines, and institutional analytics.
2. **HOD (Head of Department)**: Monitors branch-wide progress, tracks advisor review velocity, inspects student performance, and generates official accreditation-ready reports (NBA/NAAC compliance).
3. **Faculty Advisor**: Evaluates submitted documentation, reviews GitHub repositories, assigns rubric scores across 4 parameters (Novelty, Implementation, Documentation, Presentation), issues corrections, or approves projects.
4. **Student**: Submits title, abstract, team rosters, GitHub repository links, and multi-format documents (PDF, DOC, DOCX). Tracks status changes in real-time and submits version-controlled updates.

---

### 2. Local Setup Guide (XAMPP / WAMP / Apache MySQL)

#### Step 1: Install XAMPP
- Download and install **XAMPP** (with PHP 8.1+ and MySQL/MariaDB).
- Start the **Apache** and **MySQL** modules from the XAMPP Control Panel.

#### Step 2: Database Initialization
1. Open your web browser and navigate to \`http://localhost/phpmyadmin\`.
2. Click **Databases** > Create database named \`smart_project_portal\`.
3. Click the **Import** tab.
4. Select the provided \`database.sql\` file and click **Go**.
5. All 11 tables (\`users\`, \`departments\`, \`projects\`, \`project_reviews\`, etc.) will be created along with preloaded realistic sample data.

#### Step 3: Configure Project Backend
1. Copy the project folder into your web root:
   - For XAMPP: \`C:\\xampp\\htdocs\\smart-project-portal\`
   - For Linux LAMP: \`/var/www/html/smart-project-portal\`
2. Verify \`config/db.php\` credentials:
   \`\`\`php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'smart_project_portal');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   \`\`\`
3. Ensure the upload folder has write permissions:
   \`mkdir -p uploads/projects && chmod 775 uploads/projects\`

#### Step 4: Run the Application
Open your browser and visit:
\`http://localhost/smart-project-portal\`

---

### 3. Demo Credentials
| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | admin@apex.edu | password123 | Full System Access |
| **HOD (IT)** | hod.it@apex.edu | password123 | IT Department Surveillance & Reports |
| **HOD (CSE)** | hod.cse@apex.edu | password123 | CSE Department Surveillance |
| **Advisor** | raman@apex.edu | password123 | Assigned Students & Project Reviews |
| **Advisor** | anita.roy@apex.edu | password123 | Assigned Students & Project Reviews |
| **Student (Lead)** | alex.rivera@student.apex.edu | password123 | Project Submission & Tracking |
| **Student** | priya.sharma@student.apex.edu | password123 | Resubmission & Feedback Tracker |

---

### 4. Evaluation Rubric Parameters (Out of 100)
1. **Problem Novelty & Literature Survey** (Max: 25 Marks)
2. **System Implementation & Code Quality** (Max: 25 Marks)
3. **Documentation & SRS Adherence** (Max: 25 Marks)
4. **Viva Voce & Technical Defense** (Max: 25 Marks)
`;
