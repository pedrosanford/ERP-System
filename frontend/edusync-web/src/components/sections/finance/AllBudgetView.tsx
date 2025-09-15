import React, { useState } from 'react';
import { FiArrowLeft, FiTarget, FiDollarSign, FiPlus, FiTrash2, FiTrendingUp, FiTrendingDown, FiAlertTriangle, FiEdit } from 'react-icons/fi';

interface AllBudgetViewProps {
  onBack: () => void;
}

interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  department: string;
  fiscalYear: string;
}

const AllBudgetView: React.FC<AllBudgetViewProps> = ({ onBack }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2024');
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetItem | null>(null);

  // Mock data - расширенный список
  const budgetItems: BudgetItem[] = [
    {
      id: '1',
      category: 'Academic Programs',
      allocated: 50000,
      spent: 32000,
      remaining: 18000,
      percentage: 64,
      department: 'Academic Affairs',
      fiscalYear: '2024'
    },
    {
      id: '2',
      category: 'Facilities & Equipment',
      allocated: 25000,
      spent: 15000,
      remaining: 10000,
      percentage: 60,
      department: 'Facilities',
      fiscalYear: '2024'
    },
    {
      id: '3',
      category: 'Staff Salaries',
      allocated: 80000,
      spent: 80000,
      remaining: 0,
      percentage: 100,
      department: 'Human Resources',
      fiscalYear: '2024'
    },
    {
      id: '4',
      category: 'Marketing & Outreach',
      allocated: 15000,
      spent: 8500,
      remaining: 6500,
      percentage: 57,
      department: 'Marketing',
      fiscalYear: '2024'
    },
    {
      id: '5',
      category: 'Technology & IT',
      allocated: 20000,
      spent: 12000,
      remaining: 8000,
      percentage: 60,
      department: 'IT Services',
      fiscalYear: '2024'
    },
    {
      id: '6',
      category: 'Research & Development',
      allocated: 30000,
      spent: 28000,
      remaining: 2000,
      percentage: 93,
      department: 'Research',
      fiscalYear: '2024'
    },
    {
      id: '7',
      category: 'Student Services',
      allocated: 18000,
      spent: 17500,
      remaining: 500,
      percentage: 97,
      department: 'Student Affairs',
      fiscalYear: '2024'
    },
    {
      id: '8',
      category: 'Library Resources',
      allocated: 12000,
      spent: 8000,
      remaining: 4000,
      percentage: 67,
      department: 'Library',
      fiscalYear: '2024'
    }
  ];

  const filteredBudgets = budgetItems.filter(budget => {
    const matchesDepartment = selectedDepartment === 'all' || budget.department === selectedDepartment;
    const matchesFiscalYear = budget.fiscalYear === selectedFiscalYear;
    return matchesDepartment && matchesFiscalYear;
  });

  const totalAllocated = filteredBudgets.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = filteredBudgets.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = (totalSpent / totalAllocated) * 100;

  const overBudgetItems = filteredBudgets.filter(item => item.percentage >= 90);
  const nearBudgetItems = filteredBudgets.filter(item => item.percentage >= 75 && item.percentage < 90);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <FiAlertTriangle className="w-4 h-4 text-red-600" />;
    if (percentage >= 75) return <FiTrendingUp className="w-4 h-4 text-yellow-600" />;
    return <FiTrendingDown className="w-4 h-4 text-green-600" />;
  };

  const departments = [...new Set(budgetItems.map(item => item.department))];

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
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Complete budget planning and monitoring system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewBudgetForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FiTarget className="w-4 h-4" />
            <span>Budget Planning</span>
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">${totalAllocated.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Allocated</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">${totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className={`p-6 rounded-lg shadow-sm border border-gray-200 text-center ${totalRemaining >= 0 ? 'bg-white' : 'bg-red-50'}`}>
          <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalRemaining.toLocaleString()}
          </div>
          <div className={`text-sm ${totalRemaining >= 0 ? 'text-gray-600' : 'text-red-600'}`}>Remaining</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{overallPercentage.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Utilization</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="2024">Fiscal Year 2024</option>
              <option value="2023">Fiscal Year 2023</option>
              <option value="2022">Fiscal Year 2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {(overBudgetItems.length > 0 || nearBudgetItems.length > 0) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Alerts</h3>
          <div className="space-y-3">
            {overBudgetItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <FiAlertTriangle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-900">{item.category}</div>
                  <div className="text-xs text-red-700">{item.department} • Over budget by ${(item.spent - item.allocated).toLocaleString()}</div>
                </div>
                <div className="text-sm font-medium text-red-600">{item.percentage}%</div>
              </div>
            ))}
            {nearBudgetItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FiTrendingUp className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-yellow-900">{item.category}</div>
                  <div className="text-xs text-yellow-700">{item.department} • Approaching budget limit</div>
                </div>
                <div className="text-sm font-medium text-yellow-600">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Categories */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Budget Categories</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredBudgets.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiTarget className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.category}</h4>
                    <p className="text-sm text-gray-600">{item.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(item.percentage)}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{item.percentage}% utilized</div>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full ${getProgressColor(item.percentage)}`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 text-xs text-gray-500">
                  <span>Remaining: ${item.remaining.toLocaleString()}</span>
                  <span>{item.percentage >= 100 ? 'Over Budget' : 'On Track'}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedBudget(item)}
                    className="text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Detail Modal */}
      {selectedBudget && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedBudget(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Budget Details</h3>
                <button
                  onClick={() => setSelectedBudget(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="text-sm text-gray-900">{selectedBudget.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="text-sm text-gray-900">{selectedBudget.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fiscal Year</label>
                    <p className="text-sm text-gray-900">{selectedBudget.fiscalYear}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Utilization</label>
                    <p className="text-sm font-medium text-gray-900">{selectedBudget.percentage}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allocated Amount</label>
                    <p className="text-sm font-medium text-gray-900">${selectedBudget.allocated.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Spent Amount</label>
                    <p className="text-sm font-medium text-gray-900">${selectedBudget.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
                    <p className={`text-sm font-medium ${selectedBudget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${selectedBudget.remaining.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900">{selectedBudget.percentage >= 100 ? 'Over Budget' : 'On Track'}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${getProgressColor(selectedBudget.percentage)}`}
                      style={{ width: `${Math.min(selectedBudget.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{selectedBudget.percentage}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBudgetView;
