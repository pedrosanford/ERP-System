import React, { useState } from 'react';
import { FiUsers, FiToggleLeft, FiSettings } from 'react-icons/fi';
import UserManagement from './UserManagement.tsx';
import FeatureToggles from './FeatureToggles.tsx';

type SettingsTab = 'users' | 'features';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

  const tabs = [
    {
      id: 'users' as const,
      name: 'Users & Roles',
      icon: FiUsers,
      description: 'Manage users, roles, and permissions'
    },
    {
      id: 'features' as const,
      name: 'Feature Toggles',
      icon: FiToggleLeft,
      description: 'Enable or disable system modules'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FiSettings className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-600">Configure system preferences, manage users, and control feature access</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-start py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </div>
                <span className="text-xs text-gray-400 mt-1">{tab.description}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'features' && <FeatureToggles />}
      </div>
    </div>
  );
};

export default Settings;