import React from 'react';
import { FiUsers, FiUserPlus, FiDollarSign, FiCalendar, FiAward, FiMail } from 'react-icons/fi';

const HR: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Management</h1>
          <p className="text-gray-600">Manage staff, payroll, and human resources</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <FiUserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+5 new this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <FiUsers className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+5 new this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <FiAward className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">No change</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
              <p className="text-2xl font-bold text-gray-900">$65,000</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+3% from last year</p>
        </div>
      </div>

      {/* HR Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Employees */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Employees</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">SJ</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Mathematics Department • Professor</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-700">MC</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Michael Chen</p>
                    <p className="text-sm text-gray-500">Computer Science • Associate Professor</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">ED</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Emily Davis</p>
                    <p className="text-sm text-gray-500">Business Administration • Professor</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">On Leave</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
              <FiUserPlus className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <FiDollarSign className="w-5 h-5" />
              <span>Process Payroll</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <FiCalendar className="w-5 h-5" />
              <span>Schedule Meeting</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <FiAward className="w-5 h-5" />
              <span>Performance Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HR;
