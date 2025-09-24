import React, { useState } from 'react';
import { useModules } from '../../../context/ModuleContext';
import { 
  FiHome,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiSettings,
  FiToggleLeft,
  FiToggleRight,
  FiSave,
  FiRotateCw
} from 'react-icons/fi';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  essential: boolean; // Cannot be disabled
  dependencies?: string[]; // Other modules this depends on
}

const FeatureToggles: React.FC = () => {
  const { enabledModules, updateModuleState } = useModules();
  const moduleDefinitions: Module[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Main dashboard with overview and analytics',
      icon: FiHome,
      enabled: enabledModules.includes('dashboard'),
      essential: true
    },
    {
      id: 'hr',
      name: 'HR Management',
      description: 'Human resources, staff, and student management',
      icon: FiUsers,
      enabled: enabledModules.includes('hr'),
      essential: false,
      dependencies: ['dashboard']
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'Financial operations, transactions, and budgeting',
      icon: FiDollarSign,
      enabled: enabledModules.includes('finance'),
      essential: false,
      dependencies: ['dashboard']
    },
    {
      id: 'sales',
      name: 'Sales & CRM',
      description: 'Sales pipeline, leads, and customer management',
      icon: FiTrendingUp,
      enabled: enabledModules.includes('sales'),
      essential: false,
      dependencies: ['dashboard']
    }
  ];

  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModule = (moduleId: string) => {
    const module = moduleDefinitions.find(m => m.id === moduleId);
    if (!module || module.essential) return;
    
    const newEnabled = !module.enabled;
    updateModuleState(moduleId, newEnabled);
    setHasChanges(true);
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save module configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasChanges(false);
      // TODO: Show success message
    } catch (error) {
      // TODO: Handle error
      console.error('Failed to save changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChanges = () => {
    // Reset to default configuration
    const defaultModules = ['dashboard', 'hr', 'finance', 'sales'];
    defaultModules.forEach(moduleId => {
      updateModuleState(moduleId, true);
    });
    setHasChanges(false);
  };

  const getModuleDependencyText = (module: Module) => {
    if (!module.dependencies || module.dependencies.length === 0) {
      return null;
    }
    
    const dependencyNames = module.dependencies.map(depId => 
      moduleDefinitions.find(m => m.id === depId)?.name
    ).filter(Boolean);
    
    return `Requires: ${dependencyNames.join(', ')}`;
  };

  const getEnabledCount = () => {
    return moduleDefinitions.filter(module => module.enabled).length;
  };

  const getTotalCount = () => {
    return moduleDefinitions.length;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Feature Toggles</h3>
            <p className="text-sm text-gray-500">
              Enable or disable system modules. Changes affect sidebar navigation and user access.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <>
                <button
                  onClick={resetChanges}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  <FiRotateCw className="w-4 h-4 mr-2" />
                  Reset
                </button>
                <button
                  onClick={saveChanges}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-md"
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary-600">{getEnabledCount()}</div>
            <div className="text-sm text-primary-600">Modules Enabled</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">{getTotalCount() - getEnabledCount()}</div>
            <div className="text-sm text-gray-600">Modules Disabled</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((getEnabledCount() / getTotalCount()) * 100)}%
            </div>
            <div className="text-sm text-green-600">System Coverage</div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FiSettings className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Unsaved Changes
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You have unsaved changes to the module configuration. 
                  These changes will affect all users' access to features and sidebar navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleDefinitions.map((module) => {
          const Icon = module.icon;
          const dependencyText = getModuleDependencyText(module);
          
          return (
            <div 
              key={module.id} 
              className={`relative bg-white border-2 rounded-lg p-6 transition-all ${
                module.enabled 
                  ? 'border-primary-200 bg-primary-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Essential Badge */}
              {module.essential && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Essential
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${
                      module.enabled 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className={`ml-3 text-lg font-medium ${
                      module.enabled ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {module.name}
                    </h4>
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    module.enabled ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {module.description}
                  </p>
                  
                  {dependencyText && (
                    <p className="text-xs text-gray-500 mb-3">
                      {dependencyText}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  module.enabled ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  {module.enabled ? 'Enabled' : 'Disabled'}
                </span>
                
                <button
                  onClick={() => toggleModule(module.id)}
                  disabled={module.essential}
                  className={`p-1 rounded-full transition-colors ${
                    module.essential 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {module.enabled ? (
                    <FiToggleRight className="w-8 h-8 text-primary-600" />
                  ) : (
                    <FiToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Dependency Warning */}
              {!module.enabled && module.dependencies && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  This module requires other modules to be enabled first.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-lg font-medium text-blue-900 mb-2">How Feature Toggles Work</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• <strong>Essential modules</strong> cannot be disabled as they are required for system operation</li>
          <li>• <strong>Dependencies</strong> must be enabled before dependent modules can be activated</li>
          <li>• <strong>Sidebar navigation</strong> will automatically update based on enabled modules</li>
          <li>• <strong>User permissions</strong> are still enforced within enabled modules</li>
          <li>• Changes take effect immediately after saving</li>
        </ul>
      </div>
    </div>
  );
};

export default FeatureToggles;