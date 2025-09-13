import React from 'react';
import { FiBookOpen, FiUsers, FiAward, FiCalendar, FiPlus, FiEdit } from 'react-icons/fi';

const Academics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academics</h1>
          <p className="text-gray-600">Manage courses, programs, and academic operations</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <FiPlus className="w-4 h-4" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <FiBookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+8% from last semester</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">142</p>
            </div>
            <FiBookOpen className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+5% from last semester</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <FiAward className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">No change</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faculty Members</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <FiUsers className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+3 new this semester</p>
        </div>
      </div>

      {/* Academics Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Courses */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Courses</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiBookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mathematics 101</p>
                    <p className="text-sm text-gray-500">Dr. Sarah Johnson • 45 students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiBookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Computer Science 201</p>
                    <p className="text-sm text-gray-500">Prof. Michael Chen • 38 students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiBookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Business Administration 301</p>
                    <p className="text-sm text-gray-500">Dr. Emily Davis • 52 students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Planning</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiEdit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Calendar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Academic Calendar</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <FiCalendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Midterm Exams</p>
                <p className="text-xs text-gray-500">Oct 15-20, 2024</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <FiCalendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Course Registration</p>
                <p className="text-xs text-gray-500">Nov 1-15, 2024</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <FiCalendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Final Exams</p>
                <p className="text-xs text-gray-500">Dec 10-20, 2024</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <FiCalendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Graduation Ceremony</p>
                <p className="text-xs text-gray-500">Dec 22, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academics;
