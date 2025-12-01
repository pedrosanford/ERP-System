import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import Students from './sections/HR-Management/Students.tsx';
import Finance from './sections/Finance';
import Sales from './sections/Sales';
import EmailTemplates from './sections/sales/EmailTemplates';
import ProfileSettings from './sections/ProfileSettings';
import Settings from './sections/settings/Settings';
import NotificationDropdown from './NotificationDropdown';
import { FiMenu, FiBell, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import Staff from "./sections/HR-Management/Staff.tsx";
import DocumentUpload from "./sections/HR-Management/DocumentUpload.tsx";
import StaffEvaluation from "./sections/HR-Management/StaffEvaluation.tsx";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Load active section from localStorage or default to 'dashboard'
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'dashboard';
  });
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Save activeSection to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileClick = () => {
    setActiveSection('profile-settings');
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('activeSection'); // Clear on logout
    navigate('/auth');
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Listen for navigation events from Dashboard
  useEffect(() => {
    const handleDashboardNavigation = (event: CustomEvent<string>) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('dashboard-navigate', handleDashboardNavigation as EventListener);
    return () => {
      window.removeEventListener('dashboard-navigate', handleDashboardNavigation as EventListener);
    };
  }, []);

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'staff':
        return <Staff />;
      case 'documents':
        return <DocumentUpload />;
      case 'staff evaluation':
        return <StaffEvaluation />;
      case 'finance':
      case 'finance-tuition':
      case 'finance-scholarships':
      case 'finance-salaries':
      case 'finance-expenses':
        return <Finance activeSection={activeSection} />;
      case 'sales':
      case 'sales-pipeline':
        return <Sales />;
      case 'email-templates':
        return <EmailTemplates />;
      case 'profile-settings':
        return <ProfileSettings />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 h-16">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiMenu className="w-4 h-4 text-gray-600" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FiBell className="w-4 h-4 text-gray-600" />
                  {unreadCount > 0 && (
                    <>
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </>
                  )}
                </button>
                <NotificationDropdown 
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>

              {/* User avatar */}
              <div className="relative" ref={userMenuRef}>
                <div 
                  className="w-7 h-7 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.avatarData ? (
                    <img 
                      src={user.avatarData} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium text-xs">
                      {user ? user.name.split(' ').map(n => n[0]).join('') : 'PS'}
                    </span>
                  )}
                </div>
                
                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Pedro Sanford'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'pedro@edusync.com'}</p>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiUser className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 max-w-7xl mx-auto min-h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;
