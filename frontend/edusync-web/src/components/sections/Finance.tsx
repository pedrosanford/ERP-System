import React from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCreditCard, FiPieChart } from 'react-icons/fi';

const Finance: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600">Manage financial operations and reporting</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <FiCreditCard className="w-4 h-4" />
          <span>Process Payment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$452,230</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45,230</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">$323,700</p>
            </div>
            <FiTrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+0.7% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">$128,530</p>
            </div>
            <FiPieChart className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+68% profit margin</p>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tuition Payment</p>
                    <p className="text-sm text-gray-500">John Smith - CS Program</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$3,500</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Course Fee</p>
                    <p className="text-sm text-gray-500">Maria Johnson - Business</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$2,800</p>
                  <p className="text-sm text-gray-500">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiTrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Equipment Purchase</p>
                    <p className="text-sm text-gray-500">Lab Equipment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-$1,200</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
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
              <FiCreditCard className="w-5 h-5" />
              <span>Process Payment</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <FiDollarSign className="w-5 h-5" />
              <span>Generate Invoice</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <FiPieChart className="w-5 h-5" />
              <span>View Reports</span>
            </button>
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <FiTrendingUp className="w-5 h-5" />
              <span>Financial Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
