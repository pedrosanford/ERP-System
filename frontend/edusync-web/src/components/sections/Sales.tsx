import React from 'react';
import { FiTarget, FiUsers, FiTrendingUp, FiDollarSign, FiPhone, FiMail } from 'react-icons/fi';

const Sales: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600">Track sales performance and manage leads</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <FiUsers className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">$125,430</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+22.5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
              <p className="text-2xl font-bold text-gray-900">$125,430</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+22.5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Leads</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <FiUsers className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+18% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">18.5%</p>
            </div>
            <FiTarget className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+3.2% from last month</p>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">AS</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Alex Smith</p>
                    <p className="text-sm text-gray-500">alex.smith@email.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Hot Lead</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiPhone className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-700">EJ</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Emma Johnson</p>
                    <p className="text-sm text-gray-500">emma.johnson@email.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Warm Lead</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiPhone className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">MW</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Michael Wilson</p>
                    <p className="text-sm text-gray-500">michael.wilson@email.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Cold Lead</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiPhone className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Pipeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Sales Pipeline</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Prospects</span>
              <span className="text-sm font-bold text-gray-900">25</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Qualified</span>
              <span className="text-sm font-bold text-gray-900">18</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '18%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Proposal</span>
              <span className="text-sm font-bold text-gray-900">12</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '12%' }}></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Closed Won</span>
              <span className="text-sm font-bold text-gray-900">8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '8%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
