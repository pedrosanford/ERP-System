import React, { useState } from 'react';
import { FiArrowLeft, FiDownload, FiFilter, FiTrendingUp, FiTrendingDown, FiPieChart, FiBarChart, FiDollarSign, FiCalendar, FiEye } from 'react-icons/fi';

interface FinancialAnalyticsViewProps {
  onBack: () => void;
}

const FinancialAnalyticsView: React.FC<FinancialAnalyticsViewProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedChart, setSelectedChart] = useState('revenue');

  // Mock data for charts
  const revenueData = [
    { month: 'Jul', amount: 42000, growth: 5.2 },
    { month: 'Aug', amount: 45000, growth: 7.1 },
    { month: 'Sep', amount: 48000, growth: 6.7 },
    { month: 'Oct', amount: 52000, growth: 8.3 },
    { month: 'Nov', amount: 49000, growth: -5.8 },
    { month: 'Dec', amount: 55000, growth: 12.2 }
  ];

  const expenseData = [
    { category: 'Salaries', amount: 32000, percentage: 45 },
    { category: 'Facilities', amount: 15000, percentage: 21 },
    { category: 'Technology', amount: 12000, percentage: 17 },
    { category: 'Marketing', amount: 8500, percentage: 12 },
    { category: 'Other', amount: 3500, percentage: 5 }
  ];

  const profitData = [
    { month: 'Jul', revenue: 42000, expenses: 35000, profit: 7000 },
    { month: 'Aug', revenue: 45000, expenses: 36000, profit: 9000 },
    { month: 'Sep', revenue: 48000, expenses: 38000, profit: 10000 },
    { month: 'Oct', revenue: 52000, expenses: 40000, profit: 12000 },
    { month: 'Nov', revenue: 49000, expenses: 42000, profit: 7000 },
    { month: 'Dec', revenue: 55000, expenses: 45000, profit: 10000 }
  ];

  const kpiData = [
    { title: 'Total Revenue', value: '$295,000', change: '+12.5%', trend: 'up', period: 'vs last 6 months' },
    { title: 'Total Expenses', value: '$236,000', change: '+8.2%', trend: 'up', period: 'vs last 6 months' },
    { title: 'Net Profit', value: '$59,000', change: '+28.3%', trend: 'up', period: 'vs last 6 months' },
    { title: 'Profit Margin', value: '20.0%', change: '+2.1%', trend: 'up', period: 'vs last 6 months' },
    { title: 'Avg Monthly Revenue', value: '$49,167', change: '+15.7%', trend: 'up', period: 'vs last 6 months' },
    { title: 'Revenue Growth Rate', value: '8.4%', change: '+1.2%', trend: 'up', period: 'monthly average' }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <FiTrendingUp className="w-4 h-4 text-green-600" /> : 
      <FiTrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Finance</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="text-gray-600">Comprehensive financial insights and trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="2years">Last 2 Years</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FiDownload className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
              {getTrendIcon(kpi.trend)}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                {kpi.change}
              </span>
              <span className="text-xs text-gray-500">{kpi.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
            </div>
            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors">
              <FiEye className="w-4 h-4" />
            </button>
          </div>
          
          {/* Simple Bar Chart Representation */}
          <div className="space-y-3">
            {revenueData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 text-sm text-gray-600">{item.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.amount / 60000) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      ${(item.amount / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                <div className={`text-sm font-medium ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.growth >= 0 ? '+' : ''}{item.growth}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FiPieChart className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Expense Breakdown</h3>
            </div>
            <button className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors">
              <FiEye className="w-4 h-4" />
            </button>
          </div>
          
          {/* Simple Pie Chart Representation */}
          <div className="space-y-4">
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit & Loss Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FiBarChart className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Profit & Loss Analysis</h3>
          </div>
          <button className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors">
            <FiEye className="w-4 h-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Month</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Expenses</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Profit</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Margin</th>
              </tr>
            </thead>
            <tbody>
              {profitData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.month}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${item.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">${item.expenses.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-sm font-medium text-right ${
                    item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${item.profit.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">
                    {((item.profit / item.revenue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Revenue has grown consistently over the past 6 months</p>
                <p className="text-xs text-gray-500">Average growth rate of 8.4%</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Salaries remain the largest expense category</p>
                <p className="text-xs text-gray-500">45% of total expenses</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Profit margin improved by 2.1% this period</p>
                <p className="text-xs text-gray-500">From 17.9% to 20.0%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Consider diversifying revenue streams</p>
                <p className="text-xs text-gray-500">Reduce dependency on tuition fees</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Optimize technology spending</p>
                <p className="text-xs text-gray-500">17% of expenses could be more efficient</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Monitor seasonal revenue patterns</p>
                <p className="text-xs text-gray-500">November showed 5.8% decline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalyticsView;
