import React, { useState } from 'react';
import { FiPieChart, FiDownload, FiCalendar, FiEye, FiFileText, FiBarChart, FiTrendingUp } from 'react-icons/fi';

interface ViewReportsSectionProps {
  onViewAll: () => void;
}

interface ReportRecord {
  id: string;
  name: string;
  type: string;
  description: string;
  generatedDate: string;
  period: string;
  status: 'ready' | 'generating' | 'failed';
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

const ViewReportsSection: React.FC<ViewReportsSectionProps> = ({ onViewAll }) => {
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Mock data
  const reports: ReportRecord[] = [
    {
      id: 'RPT-001',
      name: 'Monthly Revenue Report',
      type: 'revenue',
      description: 'Comprehensive monthly revenue analysis with trends',
      generatedDate: '2024-01-15',
      period: 'December 2023',
      status: 'ready',
      size: '2.3 MB',
      format: 'pdf'
    },
    {
      id: 'RPT-002',
      name: 'Student Payment Status',
      type: 'payments',
      description: 'Current payment status for all enrolled students',
      generatedDate: '2024-01-14',
      period: 'January 2024',
      status: 'ready',
      size: '1.8 MB',
      format: 'excel'
    },
    {
      id: 'RPT-003',
      name: 'Expense Breakdown Analysis',
      type: 'expenses',
      description: 'Detailed expense analysis by category and department',
      generatedDate: '2024-01-13',
      period: 'Q4 2023',
      status: 'ready',
      size: '3.1 MB',
      format: 'pdf'
    },
    {
      id: 'RPT-004',
      name: 'Financial Summary Dashboard',
      type: 'summary',
      description: 'Executive summary of financial performance',
      generatedDate: '2024-01-12',
      period: '2023 Annual',
      status: 'generating',
      size: '0 MB',
      format: 'pdf'
    }
  ];

  const filteredReports = reports.filter(report => 
    selectedReportType === 'all' || report.type === selectedReportType
  );

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      ready: 'bg-green-100 text-green-800',
      generating: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FiFileText className="w-4 h-4 text-red-600" />;
      case 'excel':
        return <FiBarChart className="w-4 h-4 text-green-600" />;
      case 'csv':
        return <FiFileText className="w-4 h-4 text-blue-600" />;
      default:
        return <FiFileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <FiTrendingUp className="w-5 h-5 text-green-600" />;
      case 'payments':
        return <FiPieChart className="w-5 h-5 text-blue-600" />;
      case 'expenses':
        return <FiBarChart className="w-5 h-5 text-red-600" />;
      case 'summary':
        return <FiPieChart className="w-5 h-5 text-purple-600" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const totalReports = reports.length;
  const readyReports = reports.filter(r => r.status === 'ready').length;
  const generatingReports = reports.filter(r => r.status === 'generating').length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiPieChart className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Financial Reports</h3>
              <p className="text-sm text-gray-600">Generate and manage financial reports</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiDownload className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
            <button 
              onClick={onViewAll}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalReports}</div>
            <div className="text-sm text-blue-600">Total Reports</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{readyReports}</div>
            <div className="text-sm text-green-600">Ready</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{generatingReports}</div>
            <div className="text-sm text-yellow-600">Generating</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Report Types</option>
              <option value="revenue">Revenue Reports</option>
              <option value="payments">Payment Reports</option>
              <option value="expenses">Expense Reports</option>
              <option value="summary">Summary Reports</option>
            </select>
          </div>
          <div className="flex-1">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="2years">Last 2 Years</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="space-y-3">
          {filteredReports.slice(0, 3).map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {getTypeIcon(report.type)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{report.name}</div>
                  <div className="text-sm text-gray-600">{report.description}</div>
                  <div className="text-sm text-gray-500">Period: {report.period}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  {getFormatIcon(report.format)}
                  <span className="text-sm text-gray-600">{report.format.toUpperCase()}</span>
                </div>
                <div className="text-sm text-gray-600">{report.size}</div>
                <div className="mt-1">{getStatusBadge(report.status)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Revenue Analysis</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Generate comprehensive revenue reports with trends and projections</p>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
              Generate Revenue Report →
            </button>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiPieChart className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Payment Status</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Track student payment status and outstanding balances</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              Generate Payment Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReportsSection;
