import React, { useState } from 'react';
import { FiTarget, FiDollarSign, FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi';

interface ManageBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BudgetItem {
  id: string;
  category: string;
  allocated: string;
  spent: string;
  remaining: string;
}

const ManageBudgetModal: React.FC<ManageBudgetModalProps> = ({ onClose }) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Academic Programs', allocated: '50000', spent: '32000', remaining: '18000' },
    { id: '2', category: 'Facilities & Equipment', allocated: '25000', spent: '15000', remaining: '10000' },
    { id: '3', category: 'Staff Salaries', allocated: '80000', spent: '80000', remaining: '0' },
    { id: '4', category: 'Marketing & Outreach', allocated: '15000', spent: '8500', remaining: '6500' },
    { id: '5', category: 'Technology & IT', allocated: '20000', spent: '12000', remaining: '8000' }
  ]);

  const [newBudgetItem, setNewBudgetItem] = useState({
    category: '',
    allocated: ''
  });

  const handleAddBudgetItem = () => {
    if (newBudgetItem.category && newBudgetItem.allocated) {
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        category: newBudgetItem.category,
        allocated: newBudgetItem.allocated,
        spent: '0',
        remaining: newBudgetItem.allocated
      };
      setBudgetItems([...budgetItems, newItem]);
      setNewBudgetItem({ category: '', allocated: '' });
    }
  };

  const handleRemoveBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const handleUpdateAllocated = (id: string, value: string) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        const allocated = parseFloat(value) || 0;
        const spent = parseFloat(item.spent) || 0;
        return {
          ...item,
          allocated: value,
          remaining: (allocated - spent).toString()
        };
      }
      return item;
    }));
  };

  const totalAllocated = budgetItems.reduce((sum, item) => sum + (parseFloat(item.allocated) || 0), 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + (parseFloat(item.spent) || 0), 0);
  const totalRemaining = totalAllocated - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-purple-600">
        <FiTarget className="w-6 h-6" />
        <h4 className="text-lg font-medium">Budget Management</h4>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">${totalAllocated.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Allocated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">${totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalRemaining.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      {/* Budget Items */}
      <div>
        <h5 className="font-medium text-gray-900 mb-3">Budget Categories</h5>
        <div className="space-y-3">
          {budgetItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={item.category}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  readOnly
                />
              </div>
              <div className="w-32">
                <div className="relative">
                  <FiDollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="number"
                    value={item.allocated}
                    onChange={(e) => handleUpdateAllocated(item.id, e.target.value)}
                    className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div className="w-24 text-sm text-gray-600 text-center">
                ${(parseFloat(item.spent) || 0).toLocaleString()}
              </div>
              <div className={`w-24 text-sm text-center font-medium ${
                (parseFloat(item.remaining) || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${(parseFloat(item.remaining) || 0).toLocaleString()}
              </div>
              <button
                onClick={() => handleRemoveBudgetItem(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Budget Item */}
      <div className="border-t border-gray-200 pt-4">
        <h5 className="font-medium text-gray-900 mb-3">Add New Budget Category</h5>
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newBudgetItem.category}
              onChange={(e) => setNewBudgetItem(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Category name (e.g., Research & Development)"
            />
          </div>
          <div className="w-32">
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
              />
            </div>
          </div>
          <button
            onClick={handleAddBudgetItem}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Budget Planning Tools */}
      <div className="border-t border-gray-200 pt-4">
        <h5 className="font-medium text-gray-900 mb-3">Budget Planning Tools</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiCalendar className="w-5 h-5 text-blue-600" />
              <h6 className="font-medium text-gray-900">Monthly Forecast</h6>
            </div>
            <p className="text-sm text-gray-600 mb-3">Project monthly spending based on current trends</p>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              Generate Forecast →
            </button>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiTarget className="w-5 h-5 text-green-600" />
              <h6 className="font-medium text-gray-900">Budget Alerts</h6>
            </div>
            <p className="text-sm text-gray-600 mb-3">Set up notifications for budget thresholds</p>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
              Configure Alerts →
            </button>
          </div>
        </div>
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
          onClick={onClose}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Budget
        </button>
      </div>
    </div>
  );
};

export default ManageBudgetModal;
