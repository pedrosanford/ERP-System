import React, { createContext, useContext, useState } from 'react';

interface ModuleContextType {
  enabledModules: string[];
  updateModuleState: (moduleId: string, enabled: boolean) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};

interface ModuleProviderProps {
  children: React.ReactNode;
}

export const ModuleProvider: React.FC<ModuleProviderProps> = ({ children }) => {
  // Default enabled modules
  const [enabledModules, setEnabledModules] = useState<string[]>([
    'dashboard',
    'hr', 
    'finance',
    'sales'
  ]);

  const updateModuleState = (moduleId: string, enabled: boolean) => {
    setEnabledModules(prev => 
      enabled 
        ? [...prev.filter(id => id !== moduleId), moduleId]
        : prev.filter(id => id !== moduleId)
    );
  };

  return (
    <ModuleContext.Provider value={{ enabledModules, updateModuleState }}>
      {children}
    </ModuleContext.Provider>
  );
};