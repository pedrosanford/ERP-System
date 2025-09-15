import React, { useState } from 'react';
import { FiTarget, FiDollarSign, FiPlus, FiTrash2, FiTrendingUp, FiTrendingDown, FiAlertTriangle } from 'react-icons/fi';

interface ManageBudgetSectionProps {
  onViewAll: () => void;
}

interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

const ManageBudgetSection: React.FC<ManageBudgetSectionProps> = ({ onViewAll }) => {
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false);
  const [newBudgetItem, setNewBudgetItem] = useState({
    category: '',
    allocated: ''
  });

  // Mock data
  const budgetItems: BudgetItem[] = [
    {
      id: '1',
      category: 'Academic Programs',
      allocated: 50000,
      spent: 32000,
      remaining: 18000,
      percentage: 64
    },
    {
      id: '2',
      category: 'Facilities & Equipment',
      allocated: 25000,
      spent: 15000,
      remaining: 10000,
      percentage: 60
    },
    {
      id: '3',
      category: 'Staff Salaries',
      allocated: 80000,
      spent: 80000,
      remaining: 0,
      percentage: 100
    },
    {
      id: '4',
      category: 'Marketing & Outreach',
      allocated: 15000,
      spent: 8500,
      remaining: 6500,
      percentage: 57
    },
    {
      id: '5',
      category: 'Technology & IT',
      allocated: 20000,
      spent: 12000,
      remaining: 8000,
      percentage: 60
    }
  ];

  const totalAllocated = budgetItems.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = (totalSpent / totalAllocated) * 100;

  const handleAddBudgetItem = () => {
    if (newBudgetItem.category && newBudgetItem.allocated) {
      // TODO: Implement adding budget item
      console.log('Adding budget item:', newBudgetItem);
      setShowNewBudgetForm(false);
      setNewBudgetItem({ category: '', allocated: '' });
    }
  };

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

  const overBudgetItems = budgetItems.filter(item => item.percentage >= 90);
  const nearBudgetItems = budgetItems.filter(item => item.percentage >= 75 && item.percentage < 90);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiTarget className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Budget Management</h3>
              <p className="text-sm text-gray-600">Monitor and manage departmental budgets</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewBudgetForm(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Category</span>
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
        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">${totalAllocated.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Allocated</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">${totalSpent.toLocaleString()}</div>
            <div className="text-sm text-blue-600">Total Spent</div>
          </div>
          <div className={`p-4 rounded-lg text-center ${totalRemaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalRemaining.toLocaleString()}
            </div>
            <div className={`text-sm ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>Remaining</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{overallPercentage.toFixed(1)}%</div>
            <div className="text-sm text-purple-600">Utilization</div>
          </div>
        </div>

        {/* Budget Alerts */}
        {(overBudgetItems.length > 0 || nearBudgetItems.length > 0) && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Budget Alerts</h4>
            <div className="space-y-2">
              {overBudgetItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <FiAlertTriangle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-900">{item.category}</div>
                    <div className="text-xs text-red-700">Over budget by ${(item.spent - item.allocated).toLocaleString()}</div>
                  </div>
                  <div className="text-sm font-medium text-red-600">{item.percentage}%</div>
                </div>
              ))}
              {nearBudgetItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-yellow-900">{item.category}</div>
                    <div className="text-xs text-yellow-700">Approaching budget limit</div>
                  </div>
                  <div className="text-sm font-medium text-yellow-600">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Categories */}
        <div className="space-y-4">
          {budgetItems.slice(0, 3).map((item) => (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{item.category}</h4>
                  {getStatusIcon(item.percentage)}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{item.percentage}% utilized</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(item.percentage)}`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Remaining: ${item.remaining.toLocaleString()}</span>
                <span>{item.percentage >= 100 ? 'Over Budget' : 'On Track'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* New Budget Category Form Modal */}
        {showNewBudgetForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowNewBudgetForm(false)} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Add Budget Category</h3>
                  <button
                    onClick={() => setShowNewBudgetForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiTrash2 className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleAddBudgetItem(); }} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      value={newBudgetItem.category}
                      onChange={(e) => setNewBudgetItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Research & Development"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Amount</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        value={newBudgetItem.allocated}
                        onChange={(e) => setNewBudgetItem(prev => ({ ...prev, allocated: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewBudgetForm(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBudgetSection;
