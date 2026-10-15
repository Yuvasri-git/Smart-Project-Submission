import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdvisorDashboard } from './components/advisor/AdvisorDashboard';
import { HODDashboard } from './components/hod/HODDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProjectDirectory } from './components/common/ProjectDirectory';
import { DeadlinesCalendarView } from './components/common/DeadlinesCalendarView';
import { ProjectDetailModal } from './components/common/ProjectDetailModal';
import { ReviewModal } from './components/advisor/ReviewModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { ProjectCodeExportModal } from './components/docs/ProjectCodeExportModal';
import { Project } from './types';

const MainPortalLayout: React.FC = () => {
  const { currentUser, projects } = usePortal();

  // Tab & Mobile Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [reviewingProject, setReviewingProject] = useState<Project | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [deliverablesModalOpen, setDeliverablesModalOpen] = useState(false);

  // If user is not logged in, show login page
  if (!currentUser) {
    return <LoginPage />;
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  // Render content based on currentTab & user role
  const renderContent = () => {
    // Shared tabs across all roles
    if (currentTab === 'projects') {
      return <ProjectDirectory onSelectProject={(id) => setSelectedProjectId(id)} />;
    }
    if (currentTab === 'deadlines' || currentTab === 'announcements') {
      return <DeadlinesCalendarView />;
    }

    // Role-specific screens
    switch (currentUser.role) {
      case 'student':
        return (
          <StudentDashboard
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        );

      case 'advisor':
        return (
          <AdvisorDashboard
            onSelectProject={(id) => setSelectedProjectId(id)}
            onOpenReviewModal={(proj) => setReviewingProject(proj)}
          />
        );

      case 'hod':
        return (
          <HODDashboard
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        );

      case 'admin':
        return (
          <AdminDashboard
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        );

      default:
        return (
          <StudentDashboard
            onSelectProject={(id) => setSelectedProjectId(id)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenDeliverables={() => setDeliverablesModalOpen(true)}
        onSelectProject={(id) => setSelectedProjectId(id)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
          onOpenDeliverables={() => setDeliverablesModalOpen(true)}
        />

        {/* Dynamic Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* MODAL 1: Project Detail Inspector Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
          onOpenReviewModal={(proj) => {
            setSelectedProjectId(null);
            setReviewingProject(proj);
          }}
          onOpenResubmitModal={(proj) => {
            // Trigger student resubmission if needed
            setSelectedProjectId(null);
            setCurrentTab('dashboard');
          }}
        />
      )}

      {/* MODAL 2: Advisor Rubric Review Modal */}
      {reviewingProject && (
        <ReviewModal
          project={reviewingProject}
          onClose={() => setReviewingProject(null)}
          onSuccess={() => {
            // Updated
          }}
        />
      )}

      {/* MODAL 3: User Profile & Security Settings Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* MODAL 4: B.Tech IT Deliverables & SQL / PHP Source Code Modal */}
      <ProjectCodeExportModal
        isOpen={deliverablesModalOpen}
        onClose={() => setDeliverablesModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainPortalLayout />
    </PortalProvider>
  );
}
