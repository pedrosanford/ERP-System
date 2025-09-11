import React from 'react';
import logoSvg from '../assets/logosvg.svg';

interface EduSyncLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const EduSyncLogo: React.FC<EduSyncLogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <img
          src={logoSvg}
          alt="EduSync Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div>
          <h1 className={`${textSizes[size]} font-bold text-gray-900`}>EduSync</h1>
          <p className="text-xs text-gray-500">ERP System</p>
        </div>
      )}
    </div>
  );
};

export default EduSyncLogo;
