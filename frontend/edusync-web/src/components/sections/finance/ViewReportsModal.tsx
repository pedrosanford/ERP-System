import React, { useState } from 'react';
import { FiPieChart, FiCalendar, FiDownload } from 'react-icons/fi';

interface ViewReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewReportsModal: React.FC<ViewReportsModalProps> = ({ onClose }) => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Report', description: 'Monthly and yearly revenue analysis' },
    { id: 'expenses', name: 'Expenses Report', description: 'Detailed expense breakdown by category' },
    { id: 'profit_loss', name: 'Profit & Loss', description: 'Comprehensive P&L statement' },
    { id: 'cash_flow', name: 'Cash Flow Report', description: 'Cash flow analysis and projections' },
    { id: 'student_payments', name: 'Student Payments', description: 'Payment status and outstanding balances' },
    { id: 'tax_report', name: 'Tax Report', description: 'Tax-related financial data' }
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) return;
    
    // TODO: Implement report generation logic
    console.log('Generating report:', { selectedReport, dateRange });
    onClose();
  };

  const handleDownloadReport = (format: 'pdf' | 'excel') => {
    // TODO: Implement report download logic
    console.log(`Downloading ${selectedReport} as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-blue-600">
        <FiPieChart className="w-6 h-6" />
        <h4 className="text-lg font-medium">Financial Reports</h4>
      </div>

      <div className="space-y-4">
        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Report Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedReport === report.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <h5 className="font-medium text-gray-900">{report.name}</h5>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">
                Start Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">
                End Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Last 7 days', days: 7 },
              { label: 'Last 30 days', days: 30 },
              { label: 'Last 3 months', days: 90 },
              { label: 'This year', days: 365 }
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  const endDate = new Date();
                  const startDate = new Date();
                  startDate.setDate(endDate.getDate() - preset.days);
                  
                  setDateRange({
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                  });
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Preview Placeholder */}
        {selectedReport && (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">
                {reportTypes.find(r => r.id === selectedReport)?.name} Preview
              </h5>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownloadReport('pdf')}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadReport('excel')}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
            <div className="text-center py-8 text-gray-500">
              <FiPieChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Report preview will be generated here</p>
              <p className="text-sm">Select date range and click "Generate Report"</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleGenerateReport}
          disabled={!selectedReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default ViewReportsModal;
