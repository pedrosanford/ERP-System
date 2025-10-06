import React, {useState, useEffect} from 'react';
import { useModules } from '../context/ModuleContext';
import { useAuth } from '../context/AuthContext';
import {
    FiHome,
    FiUsers,
    FiDollarSign,
    FiSettings,
    FiLogOut,
    FiX,
    FiChevronDown,
    FiMail,
    FiTarget,
    FiCreditCard,
    FiPieChart,
    FiFile,
    FiTrendingUp,
    FiUser,
    FiAward
} from 'react-icons/fi';
import EduSyncLogo from './EduSyncLogo';
import {AiFillMoneyCollect} from 'react-icons/ai';

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
    children?: NavItem[];
}

const navigationItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <FiHome className="w-5 h-5"/>,
        path: '/dashboard'
    },
    {
        id: 'finance',
        label: 'Finance',
        icon: <FiDollarSign className="w-5 h-5"/>,
        path: '/finance',
        children: [
            {
                id: 'finance',
                label: 'Finance Overview',
                icon: <FiPieChart className="w-4 h-4"/>,
                path: '/finance'
            },
            {
                id: 'finance-tuition',
                label: 'Tuition & Fees',
                icon: <FiDollarSign className="w-4 h-4"/>,
                path: '/finance/tuition'
            },
            {
                id: 'finance-scholarships',
                label: 'Scholarships',
                icon: <FiAward className="w-4 h-4"/>,
                path: '/finance/scholarships'
            },
            {
                id: 'finance-salaries',
                label: 'Salaries & Payroll',
                icon: <FiUsers className="w-4 h-4"/>,
                path: '/finance/salaries'
            },
            {
                id: 'finance-expenses',
                label: 'Department Expenses',
                icon: <FiCreditCard className="w-4 h-4"/>,
                path: '/finance/expenses'
            }
        ]
    },
    {
        id: 'sales',
        label: 'Sales',
        icon: <AiFillMoneyCollect className="w-5 h-5"/>,
        path: '/sales',
        children: [
            {
                id: 'sales-pipeline',
                label: 'Pipeline',
                icon: <FiTarget className="w-4 h-4"/>,
                path: '/sales'
            },
            {
                id: 'email-templates',
                label: 'Email Templates',
                icon: <FiMail className="w-4 h-4"/>,
                path: '/email-templates'
            }
        ]
    },
    {
        id: 'hr',
        label: 'HR Management',
        icon: <FiUsers className="w-5 h-5"/>,
        path: '/hr',
        children: [
            {
                id: 'students',
                label: 'Students',
                icon: <FiUsers className="w-4 h-4"/>,
                path: '/students'
            },
            {
                id: 'staff',
                label: 'Staff',
                icon: <FiUsers className="w-4 h-4"/>,
                path: '/staff'
            },
            {
                id: 'documents',
                label: 'Documents',
                icon: <FiFile className="w-4 h-4"/>,
                path: '/documents'
            },
            {
                id: 'staff evaluation',
                label: 'Staff Evaluation',
                icon: <FiTrendingUp className="w-4 h-4"/>,
                path: '/StaffEvaluation'
            }
        ]
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <FiSettings className="w-5 h-5"/>,
        path: '/settings'
    }
];

const Sidebar: React.FC<SidebarProps> = ({isOpen, onToggle, activeSection, onSectionChange}) => {
    const { enabledModules } = useModules();
    const { user, logout } = useAuth();
    
    // Filter navigation items based on enabled modules
    const filteredNavigationItems = navigationItems.filter(item => {
        // Always show dashboard and settings
        if (item.id === 'dashboard' || item.id === 'settings') return true;
        // Show other items only if they're enabled
        return enabledModules.includes(item.id);
    });
    const [expandedItems, setExpandedItems] = useState<string[]>(() => {
        // Автоматически раскрываем родительский элемент, если активная секция является дочерней
        const parentItem = filteredNavigationItems.find(item =>
            item.children?.some(child => child.id === activeSection)
        );
        return parentItem ? [parentItem.id] : [];
    });

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const isItemExpanded = (itemId: string) => expandedItems.includes(itemId);

    const isItemActive = (item: NavItem) => {
        if (item.id === activeSection) return true;
        if (item.children) {
            return item.children.some(child => child.id === activeSection);
        }
        return false;
    };

    // Автоматически раскрываем родительские секции, если активна любая из их дочерних секций
    useEffect(() => {
        const parentItem = filteredNavigationItems.find(item =>
            item.children?.some(child => child.id === activeSection)
        );
        if (parentItem) {
            setExpandedItems(prev =>
                prev.includes(parentItem.id) ? prev : [...prev, parentItem.id]
            );
        }
    }, [activeSection, filteredNavigationItems]);
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
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 h-16">
                        <EduSyncLogo size="md" showText={true}/>

                        {/* Close button for mobile */}
                        <button
                            onClick={onToggle}
                            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <FiX className="w-4 h-4 text-gray-600"/>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {filteredNavigationItems.map((item) => (
                        <div key={item.id} className="space-y-1">
                            {/* Main navigation item */}
                            <button
                                onClick={() => {
                                    if (item.children) {
                                        // Для всех секций с подменю - просто раскрываем/скрываем
                                        toggleExpanded(item.id);
                                    } else {
                                        onSectionChange(item.id);
                                    }
                                }}
                                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                  group relative text-left
                  ${isItemActive(item)
                                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                                }
                `}
                            >
                                <div className="flex items-center space-x-3">
                  <span className={`transition-colors ${
                      isItemActive(item) ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'
                  }`}>
                    {item.icon}
                  </span>
                                    <span className="font-medium">{item.label}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {item.badge && (
                                        <span className="
                      px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-700
                      rounded-full
                    ">
                      {item.badge}
                    </span>
                                    )}
                                    {item.children && (
                                        <span className={`transition-transform duration-200 ${
                                            isItemExpanded(item.id) ? 'rotate-180' : ''
                                        }`}>
                      <FiChevronDown className="w-4 h-4"/>
                    </span>
                                    )}
                                </div>
                            </button>

                            {/* Sub-navigation items */}
                            {item.children && isItemExpanded(item.id) && (
                                <div className="ml-6 space-y-1">
                                    {item.children.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => onSectionChange(child.id)}
                                            className={`
                        w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200
                        text-sm
                        ${activeSection === child.id
                                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                      `}
                                        >
                      <span className={`transition-colors ${
                          activeSection === child.id ? 'text-primary-600' : 'text-gray-400'
                      }`}>
                        {child.icon}
                      </span>
                                            <span className="font-medium">{child.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* User section */}
                <div className="p-3 border-t border-gray-200 mt-auto">
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        {/* Profile Avatar/Icon */}
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={() => onSectionChange('profile-settings')}
                            title="Click to open Profile Settings"
                        >
                            {user ? (
                                <span className="text-white font-medium text-xs">
                                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                </span>
                            ) : (
                                <FiUser className="w-4 h-4 text-white"/>
                            )}
                        </div>
                        
                        {/* User Info */}
                        <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => onSectionChange('profile-settings')}
                            title="Click to open Profile Settings"
                        >
                            <p className="text-xs font-medium text-gray-900 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.role || 'User'}
                            </p>
                        </div>
                        
                        {/* Logout Button */}
                        <button 
                            onClick={logout}
                            className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <FiLogOut className="w-3.5 h-3.5 text-gray-500 hover:text-red-600"/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
