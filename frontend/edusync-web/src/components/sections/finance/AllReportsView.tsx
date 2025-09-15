import React, { useState } from 'react';
import { FiArrowLeft, FiDownload, FiCalendar, FiEye, FiPieChart, FiFileText, FiBarChart, FiTrendingUp, FiFilter } from 'react-icons/fi';

interface AllReportsViewProps {
  onBack: () => void;
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

const AllReportsView: React.FC<AllReportsViewProps> = ({ onBack }) => {
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);

  // Mock data - расширенный список
  const reports: ReportRecord[] = [
    {
      id: 'RPT-001',
      name: 'Monthly Revenue Report',
      type: 'revenue',
      description: 'Comprehensive monthly revenue analysis with trends and projections',
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
      description: 'Current payment status for all enrolled students with outstanding balances',
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
      description: 'Executive summary of financial performance and key metrics',
      generatedDate: '2024-01-12',
      period: '2023 Annual',
      status: 'generating',
      size: '0 MB',
      format: 'pdf'
    },
    {
      id: 'RPT-005',
      name: 'Budget vs Actual Analysis',
      type: 'budget',
      description: 'Comparison of budgeted vs actual expenses by department',
      generatedDate: '2024-01-11',
      period: 'Q4 2023',
      status: 'ready',
      size: '2.7 MB',
      format: 'excel'
    },
    {
      id: 'RPT-006',
      name: 'Cash Flow Statement',
      type: 'cashflow',
      description: 'Monthly cash flow analysis and projections',
      generatedDate: '2024-01-10',
      period: 'December 2023',
      status: 'ready',
      size: '1.9 MB',
      format: 'pdf'
    },
    {
      id: 'RPT-007',
      name: 'Tax Compliance Report',
      type: 'tax',
      description: 'Tax-related financial data and compliance status',
      generatedDate: '2024-01-09',
      period: '2023 Annual',
      status: 'failed',
      size: '0 MB',
      format: 'pdf'
    },
    {
      id: 'RPT-008',
      name: 'Student Fee Collection',
      type: 'payments',
      description: 'Detailed analysis of student fee collection rates',
      generatedDate: '2024-01-08',
      period: 'Q4 2023',
      status: 'ready',
      size: '2.1 MB',
      format: 'excel'
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
      case 'budget':
        return <FiBarChart className="w-5 h-5 text-yellow-600" />;
      case 'cashflow':
        return <FiTrendingUp className="w-5 h-5 text-indigo-600" />;
      case 'tax':
        return <FiFileText className="w-5 h-5 text-orange-600" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalReports = reports.length;
  const readyReports = reports.filter(r => r.status === 'ready').length;
  const generatingReports = reports.filter(r => r.status === 'generating').length;
  const failedReports = reports.filter(r => r.status === 'failed').length;

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
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">Complete financial reporting and analytics system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiDownload className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FiFilter className="w-4 h-4" />
            <span>Advanced Filter</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalReports}</div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{readyReports}</div>
          <div className="text-sm text-gray-600">Ready</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{generatingReports}</div>
          <div className="text-sm text-gray-600">Generating</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{failedReports}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
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
              <option value="budget">Budget Reports</option>
              <option value="cashflow">Cash Flow Reports</option>
              <option value="tax">Tax Reports</option>
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
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getTypeIcon(report.type)}
              </div>
              <div className="flex items-center space-x-2">
                {getFormatIcon(report.format)}
                <span className="text-xs text-gray-500">{report.format.toUpperCase()}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">{report.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Period:</span>
                <span className="text-gray-900">{report.period}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Generated:</span>
                <span className="text-gray-900">{formatDate(report.generatedDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Size:</span>
                <span className="text-gray-900">{report.size}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              {getStatusBadge(report.status)}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <FiEye className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FiDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedReport(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Report ID</label>
                    <p className="text-sm text-gray-900">{selectedReport.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedReport.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedReport.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Format</label>
                    <p className="text-sm text-gray-900 uppercase">{selectedReport.format}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Period</label>
                    <p className="text-sm text-gray-900">{selectedReport.period}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <p className="text-sm text-gray-900">{selectedReport.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Generated Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedReport.generatedDate)}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedReport.description}</p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReportsView;
