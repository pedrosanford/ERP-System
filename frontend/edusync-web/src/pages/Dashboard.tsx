import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Hi, welcome back!
        </h1>
        <p className="text-lg text-gray-600">
          Your education management and monitoring dashboard template.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">2,847</p>
              <p className="text-sm text-green-600 font-medium">+12% from last month</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
              <span className="text-primary-600 text-xl">👥</span>
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Active Courses</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">156</p>
              <p className="text-sm text-green-600 font-medium">+8% from last month</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center">
              <span className="text-secondary-600 text-xl">📚</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">$45,230</p>
              <p className="text-sm text-green-600 font-medium">+15% from last month</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <span className="text-green-600 text-xl">💰</span>
            </div>
          </div>
        </div>

        {/* Staff */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Staff Members</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">89</p>
              <p className="text-sm text-gray-500 font-medium">No change</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-xl">👨‍🏫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">View all</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                <span className="text-primary-600 text-lg">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New student enrolled in Mathematics 101</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center">
                <span className="text-secondary-600 text-lg">💳</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payment received from John Smith</p>
                <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Course "Advanced Physics" completed by 15 students</p>
                <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-lg">👨‍🏫</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New teacher hired: Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500 mt-1">8 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-4 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">👥</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add New Student</p>
                  <p className="text-sm text-gray-600">Enroll a new student</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg border border-secondary-200 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📚</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Create Course</p>
                  <p className="text-sm text-gray-600">Add a new course</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Process Payment</p>
                  <p className="text-sm text-gray-600">Record a payment</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Generate Report</p>
                  <p className="text-sm text-gray-600">View analytics</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
