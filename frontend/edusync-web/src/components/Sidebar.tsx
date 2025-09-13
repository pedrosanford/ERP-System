import React from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiDollarSign, 
  FiBookOpen, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import EduSyncLogo from './EduSyncLogo';
import { AiFillMoneyCollect } from 'react-icons/ai';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <FiHome className="w-5 h-5" />,
    path: '/dashboard'
  },
  {
    id: 'students',
    label: 'Students',
    icon: <FiUsers className="w-5 h-5" />,
    path: '/students',
    badge: 'New'
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: <FiDollarSign className="w-5 h-5" />,
    path: '/finance'
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: <AiFillMoneyCollect className="w-5 h-5" />,
    path: '/sales'
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: <FiBookOpen className="w-5 h-5" />,
    path: '/academics'
  },
  {
    id: 'hr',
    label: 'HR Management',
    icon: <FiUsers className="w-5 h-5" />,
    path: '/hr'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <FiSettings className="w-5 h-5" />,
    path: '/settings'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, activeSection, onSectionChange }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed lg:shadow-none lg:h-screen lg:top-0 lg:left-0
        w-64 border-r border-gray-200 flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <EduSyncLogo size="lg" showText={true} />
          
          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                group relative text-left
                ${activeSection === item.id
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span className={`transition-colors ${
                  activeSection === item.id ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              
              {item.badge && (
                <span className="
                  px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-700
                  rounded-full
                ">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">PS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Pedro Sanford</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <FiLogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
