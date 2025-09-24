import React, { useState } from 'react';
import { 
  FiPlus, 
  FiEdit, 
  FiUser, 
  FiShield, 
  FiActivity,
  FiSearch,
  FiFilter,
  FiMoreHorizontal,
  FiX,
  FiUserX,
  FiTrash2
} from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isCustom: boolean;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  module: string;
}

const UserManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles' | 'logs'>('users');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showUserActionsDropdown, setShowUserActionsDropdown] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Pedro Sanford',
      email: 'pedro@edusync.com',
      role: 'Administrator',
      status: 'active',
      lastActive: '2025-09-23T10:30:00Z',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@edusync.com',
      role: 'HR Manager',
      status: 'active',
      lastActive: '2025-09-23T09:15:00Z',
      permissions: ['hr', 'students', 'staff']
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@edusync.com',
      role: 'Finance Manager',
      status: 'active',
      lastActive: '2025-09-22T16:45:00Z',
      permissions: ['finance', 'reports']
    },
    {
      id: '4',
      name: 'Lisa Rodriguez',
      email: 'lisa@edusync.com',
      role: 'Sales Representative',
      status: 'inactive',
      lastActive: '2025-09-20T14:20:00Z',
      permissions: ['sales', 'leads']
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      userCount: 1,
      isCustom: false
    },
    {
      id: '2',
      name: 'HR Manager',
      description: 'Human resources management and student oversight',
      permissions: ['hr', 'students', 'staff', 'documents'],
      userCount: 1,
      isCustom: false
    },
    {
      id: '3',
      name: 'Finance Manager',
      description: 'Financial operations and reporting access',
      permissions: ['finance', 'reports', 'analytics'],
      userCount: 1,
      isCustom: false
    },
    {
      id: '4',
      name: 'Sales Representative',
      description: 'Sales pipeline and customer management',
      permissions: ['sales', 'leads', 'customers'],
      userCount: 1,
      isCustom: true
    }
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Pedro Sanford',
      action: 'Logged in',
      timestamp: '2025-09-23T10:30:00Z',
      ipAddress: '192.168.1.100',
      module: 'Authentication'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Johnson',
      action: 'Added new student record',
      timestamp: '2025-09-23T09:15:00Z',
      ipAddress: '192.168.1.101',
      module: 'HR Management'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Mike Chen',
      action: 'Generated financial report',
      timestamp: '2025-09-22T16:45:00Z',
      ipAddress: '192.168.1.102',
      module: 'Finance'
    },
    {
      id: '4',
      userId: '1',
      userName: 'Pedro Sanford',
      action: 'Modified user permissions',
      timestamp: '2025-09-22T14:30:00Z',
      ipAddress: '192.168.1.100',
      module: 'Settings'
    }
  ]);

  const availablePermissions = [
    { id: 'dashboard', name: 'Dashboard', description: 'Access to main dashboard' },
    { id: 'hr', name: 'HR Management', description: 'Human resources operations' },
    { id: 'students', name: 'Student Management', description: 'Student records and enrollment' },
    { id: 'staff', name: 'Staff Management', description: 'Staff records and evaluation' },
    { id: 'finance', name: 'Finance', description: 'Financial operations' },
    { id: 'sales', name: 'Sales', description: 'Sales pipeline and CRM' },
    { id: 'reports', name: 'Reports', description: 'Generate and view reports' },
    { id: 'settings', name: 'Settings', description: 'System configuration' }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(users.map(user => user.role))];

  // Handle user actions
  const handleUserAction = (action: string, userId: string) => {
    switch (action) {
      case 'edit':
        // TODO: Implement edit user functionality
        console.log('Edit user:', userId);
        break;
      case 'disable':
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
            : user
        ));
        break;
      case 'delete':
        setUsers(prev => prev.filter(user => user.id !== userId));
        break;
    }
    setShowUserActionsDropdown(null);
  };

  const InviteUserModal = () => {
    const [inviteData, setInviteData] = useState({
      email: '',
      name: '',
      role: '',
      message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Find the selected role
      const selectedRoleObj = roles.find(r => r.id === inviteData.role);
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: inviteData.name,
        email: inviteData.email,
        role: selectedRoleObj?.name || 'User',
        status: 'pending',
        lastActive: new Date().toISOString(),
        permissions: selectedRoleObj?.permissions || []
      };
      
      // Add user to the list
      setUsers(prev => [...prev, newUser]);
      
      // Update role user count
      if (selectedRoleObj) {
        setRoles(prev => prev.map(role => 
          role.id === inviteData.role 
            ? { ...role, userCount: role.userCount + 1 }
            : role
        ));
      }
      
      setShowInviteModal(false);
      setInviteData({ email: '', name: '', role: '', message: '' });
    };

    if (!showInviteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Invite User</h3>
            <button
              onClick={() => setShowInviteModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="user@edusync.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={inviteData.name}
                onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                required
                value={inviteData.role}
                onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invitation Message (Optional)
              </label>
              <textarea
                value={inviteData.message}
                onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Welcome to EduSync! You've been invited to join our team..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const RoleModal = () => {
    const [roleData, setRoleData] = useState({
      name: selectedRole?.name || '',
      description: selectedRole?.description || '',
      permissions: selectedRole?.permissions || []
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (selectedRole) {
        // Update existing role
        setRoles(prev => prev.map(role => 
          role.id === selectedRole.id 
            ? { ...role, ...roleData }
            : role
        ));
      } else {
        // Create new role
        const newRole: Role = {
          id: Date.now().toString(),
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          userCount: 0,
          isCustom: true
        };
        setRoles(prev => [...prev, newRole]);
      }
      
      setShowRoleModal(false);
      setSelectedRole(null);
    };

    const togglePermission = (permissionId: string) => {
      setRoleData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      }));
    };

    if (!showRoleModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedRole ? 'Edit Role' : 'Create Custom Role'}
            </h3>
            <button
              onClick={() => {
                setShowRoleModal(false);
                setSelectedRole(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  value={roleData.name}
                  onChange={(e) => setRoleData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Custom Role Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={roleData.description}
                  onChange={(e) => setRoleData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Role description..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availablePermissions.map(permission => (
                  <label
                    key={permission.id}
                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={roleData.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedRole(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                {selectedRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Sub-navigation */}
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            value={activeSubTab}
            onChange={(e) => setActiveSubTab(e.target.value as any)}
            className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="users">Users</option>
            <option value="roles">Roles</option>
            <option value="logs">Activity Logs</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-8">
            {[
              { id: 'users', name: 'Users', icon: FiUser },
              { id: 'roles', name: 'Roles', icon: FiShield },
              { id: 'logs', name: 'Activity Logs', icon: FiActivity }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeSubTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Users Tab */}
      {activeSubTab === 'users' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Users</h3>
              <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Invite User
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Filter
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900">Filter Users</h4>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    
                    {/* Role Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">All Roles</option>
                        {uniqueRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setRoleFilter('all');
                        }}
                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setShowFilterDropdown(false)}
                        className="px-3 py-1 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(user.status)}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={() => setShowUserActionsDropdown(
                            showUserActionsDropdown === user.id ? null : user.id
                          )}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiMoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {showUserActionsDropdown === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <button
                              onClick={() => handleUserAction('edit', user.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FiEdit className="w-4 h-4 mr-3" />
                              Edit User
                            </button>
                            <button
                              onClick={() => handleUserAction('disable', user.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <FiUserX className="w-4 h-4 mr-3" />
                              {user.status === 'active' ? 'Disable' : 'Enable'} User
                            </button>
                            <button
                              onClick={() => handleUserAction('delete', user.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <FiTrash2 className="w-4 h-4 mr-3" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeSubTab === 'roles' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Roles & Permissions</h3>
              <p className="text-sm text-gray-500">Define roles and assign permissions</p>
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Create Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FiShield className="w-5 h-5 text-primary-600 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900">{role.name}</h4>
                  </div>
                  {role.isCustom && (
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setShowRoleModal(true);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{role.userCount} users</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    role.isCustom 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {role.isCustom ? 'Custom' : 'System'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Logs Tab */}
      {activeSubTab === 'logs' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">Activity Logs</h3>
            <p className="text-sm text-gray-500">Monitor user activity and system access</p>
          </div>

          <div className="bg-white overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.action}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">{log.ipAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <InviteUserModal />
      <RoleModal />
    </div>
  );
};

export default UserManagement;