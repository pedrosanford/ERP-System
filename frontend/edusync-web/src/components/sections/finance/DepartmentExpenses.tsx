import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import hrService, { type Department as DepartmentAPI } from '../../../services/hrService';
import financeService from '../../../services/financeService';

interface Expense {
  id: string;
  vendor: string;
  amount: number;
  category: string;
  department: string;
  date: string;
  description: string;
  status: 'Pending' | 'Approved by Dept Head' | 'Approved by Finance' | 'Rejected';
  approvedBy?: string;
  receiptUrl?: string;
}

interface DepartmentBudget {
  id: string;
  department: string;
  allocatedBudget: number;
  usedBudget: number;
  remainingBudget: number;
  expenses: number;
}

interface Reimbursement {
  id: string;
  employeeName: string;
  employeeId: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  receiptUrl?: string;
}

const DepartmentExpenses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'approval' | 'budgets' | 'reimbursements'>('expenses');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReimbursementModal, setShowReimbursementModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Real departments from API
  const [departments, setDepartments] = useState<DepartmentAPI[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  
  // Real expenses from database
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  
  
  // Fetch real data on mount
  useEffect(() => {
    fetchDepartments();
    fetchExpenses();
  }, []);
  
  const fetchDepartments = async () => {
    setIsLoadingDepartments(true);
    try {
      const depts = await hrService.getAllDepartments();
      setDepartments(depts);
    } catch (err: any) {
      console.error('Failed to fetch departments:', err);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const fetchExpenses = async () => {
    setIsLoadingExpenses(true);
    setExpensesError(null);
    try {
      // Fetch department expense invoices from finance service
      const expenseTransactions = await financeService.getTransactionsByCategory('Department Expense Invoice');
      
      // Transform to Expense format
      const expensesData = expenseTransactions.map(transaction => ({
        id: transaction.transactionId,
        vendor: transaction.description.split(' - ')[0] || 'Unknown Vendor',
        amount: transaction.amount,
        category: transaction.subCategory || 'General',
        department: 'IT Department', // Since we only have IT department
        date: transaction.date,
        description: transaction.description,
        status: transaction.status === 'COMPLETED' ? 'Approved by Finance' as 'Approved by Finance' :
                transaction.status === 'PENDING' ? 'Pending' as 'Pending' : 'Rejected' as 'Rejected',
        approvedBy: transaction.createdBy,
        receiptUrl: undefined
      }));
      
      setExpenses(expensesData);
    } catch (err: any) {
      console.error('Failed to fetch expenses:', err);
      setExpensesError(err.message || 'Failed to load expenses');
    } finally {
      setIsLoadingExpenses(false);
    }
  };
  
  
  

  const [expenseForm, setExpenseForm] = useState({
    vendor: '',
    amount: '',
    category: '',
    department: '',
    date: '',
    description: ''
  });

  const [reimbursementForm, setReimbursementForm] = useState({
    employeeName: '',
    employeeId: '',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  // Real data (no mock data)
  const [budgets] = useState<DepartmentBudget[]>([]);
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setExpenseForm({
      vendor: '',
      amount: '',
      category: '',
      department: '',
      date: '',
      description: ''
    });
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      vendor: expense.vendor,
      amount: expense.amount.toString(),
      category: expense.category,
      department: expense.department,
      date: expense.date,
      description: expense.description
    });
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const handleSaveExpense = () => {
    if (!expenseForm.vendor || !expenseForm.amount || !expenseForm.category ||
        !expenseForm.department || !expenseForm.date || !expenseForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingExpense) {
      setExpenses(expenses.map(exp =>
        exp.id === editingExpense.id
          ? {
              ...exp,
              ...expenseForm,
              amount: parseFloat(expenseForm.amount)
            }
          : exp
      ));
    } else {
      const newExpense: Expense = {
        id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
        vendor: expenseForm.vendor,
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category,
        department: expenseForm.department,
        date: expenseForm.date,
        description: expenseForm.description,
        status: 'Pending'
      };
      setExpenses([...expenses, newExpense]);
    }
    setShowExpenseModal(false);
  };

  const handleApproveExpense = (id: string) => {
    setExpenses(expenses.map(exp => {
      if (exp.id === id) {
        if (exp.status === 'Pending') {
          return { ...exp, status: 'Approved by Dept Head' as 'Approved by Dept Head' };
        } else if (exp.status === 'Approved by Dept Head') {
          return { ...exp, status: 'Approved by Finance' as 'Approved by Finance' };
        }
      }
      return exp;
    }));
  };

  const handleRejectExpense = (id: string) => {
    if (window.confirm('Are you sure you want to reject this expense?')) {
      setExpenses(expenses.map(exp =>
        exp.id === id ? { ...exp, status: 'Rejected' as 'Rejected' } : exp
      ));
    }
  };

  const handleAddReimbursement = () => {
    setReimbursementForm({
      employeeName: '',
      employeeId: '',
      amount: '',
      category: '',
      date: '',
      description: ''
    });
    setShowReimbursementModal(true);
  };

  const handleSaveReimbursement = () => {
    if (!reimbursementForm.employeeName || !reimbursementForm.employeeId || !reimbursementForm.amount ||
        !reimbursementForm.category || !reimbursementForm.date || !reimbursementForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newReimbursement: Reimbursement = {
      id: `REIMB-${String(reimbursements.length + 1).padStart(3, '0')}`,
      employeeName: reimbursementForm.employeeName,
      employeeId: reimbursementForm.employeeId,
      amount: parseFloat(reimbursementForm.amount),
      category: reimbursementForm.category,
      date: reimbursementForm.date,
      description: reimbursementForm.description,
      status: 'Pending'
    };
    setReimbursements([...reimbursements, newReimbursement]);
    setShowReimbursementModal(false);
  };

  const handleApproveReimbursement = (id: string) => {
    setReimbursements(reimbursements.map(reimb =>
      reimb.id === id ? { ...reimb, status: 'Approved' as 'Approved' } : reimb
    ));
  };

  const handleRejectReimbursement = (id: string) => {
    if (window.confirm('Are you sure you want to reject this reimbursement?')) {
      setReimbursements(reimbursements.map(reimb =>
        reimb.id === id ? { ...reimb, status: 'Rejected' as 'Rejected' } : reimb
      ));
    }
  };

  const handlePayReimbursement = (id: string) => {
    setReimbursements(reimbursements.map(reimb =>
      reimb.id === id ? { ...reimb, status: 'Paid' as 'Paid' } : reimb
    ));
  };

  const renderExpenses = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Expense Records</h3>
        <button
          onClick={handleAddExpense}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Record Expense
        </button>
      </div>

      {expensesError && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {expensesError}
        </div>
      )}

      {isLoadingExpenses ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
          <span className="ml-2 text-gray-600">Loading expenses...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No expenses found. Record some expenses to see them here.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{expense.vendor}</div>
                        <div className="text-sm text-gray-500">{expense.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        expense.status === 'Approved by Finance' ? 'bg-green-100 text-green-800' :
                        expense.status === 'Approved by Dept Head' ? 'bg-blue-100 text-blue-800' :
                        expense.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderApproval = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
      <p className="text-sm text-gray-600">
        Expenses require approval from department head, followed by finance/principal approval.
      </p>

      <div className="grid gap-4">
        {expenses.filter(e => e.status === 'Pending' || e.status === 'Approved by Dept Head').map((expense) => (
          <div key={expense.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{expense.vendor}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    expense.status === 'Approved by Dept Head' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {expense.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{expense.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <span className="ml-2 font-medium text-gray-900">{expense.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 font-medium text-gray-900">{expense.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-2 font-medium text-gray-900">{expense.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="ml-2 font-bold text-gray-900">${expense.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Steps */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {expense.status === 'Pending' ? (
                    <FiAlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <FiCheck className="w-5 h-5 text-green-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Department Head</span>
                </div>
                <div className="flex-1 h-px bg-gray-300" />
                <div className="flex items-center gap-2">
                  {expense.status === 'Approved by Dept Head' ? (
                    <FiAlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Finance/Principal</span>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleRejectExpense(expense.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleApproveExpense(expense.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiCheck className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBudgets = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Department Budgets</h3>

      <div className="grid gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{budget.department} Department</h4>
                <p className="text-sm text-gray-600">{budget.expenses} expenses recorded</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${budget.allocatedBudget.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Allocated Budget</div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Budget Usage</span>
                  <span className="font-medium text-gray-900">
                    {((budget.usedBudget / budget.allocatedBudget) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      (budget.usedBudget / budget.allocatedBudget) * 100 > 80
                        ? 'bg-red-600'
                        : (budget.usedBudget / budget.allocatedBudget) * 100 > 60
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${(budget.usedBudget / budget.allocatedBudget) * 100}%` }}
                  />
                </div>
              </div>

              {/* Budget Details */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-sm text-red-600 font-medium">Used Budget</div>
                  <div className="text-xl font-bold text-red-900">${budget.usedBudget.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-600 font-medium">Remaining</div>
                  <div className="text-xl font-bold text-green-900">${budget.remainingBudget.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <button className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <FiEdit2 className="w-4 h-4 inline mr-2" />
              Adjust Budget
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReimbursements = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Staff Reimbursements</h3>
        <button
          onClick={handleAddReimbursement}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          New Reimbursement
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reimbursements.map((reimb) => (
              <tr key={reimb.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reimb.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{reimb.employeeName}</div>
                    <div className="text-sm text-gray-500">{reimb.employeeId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reimb.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${reimb.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reimb.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    reimb.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    reimb.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                    reimb.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reimb.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {reimb.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleApproveReimbursement(reimb.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectReimbursement(reimb.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {reimb.status === 'Approved' && (
                    <button
                      onClick={() => handlePayReimbursement(reimb.id)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Process Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <FiBriefcase className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Department Expenses</h2>
          <p className="text-sm text-gray-600">Record expenses, manage approvals, monitor budgets, and handle reimbursements</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'expenses'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Expense Recording
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'approval'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Approval Workflow
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'budgets'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Department Budgets
          </button>
          <button
            onClick={() => setActiveTab('reimbursements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reimbursements'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reimbursements
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'approval' && renderApproval()}
        {activeTab === 'budgets' && renderBudgets()}
        {activeTab === 'reimbursements' && renderReimbursements()}
      </div>

      {/* Add/Edit Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingExpense ? 'Edit Expense' : 'Record Expense'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  value={expenseForm.vendor}
                  onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ABC Office Supplies"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Sports">Sports</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                {isLoadingDepartments ? (
                  <div className="flex items-center justify-center py-2">
                    <FaSpinner className="animate-spin h-5 w-5 text-primary-600" />
                  </div>
                ) : (
                  <select
                    value={expenseForm.department}
                    onChange={(e) => setExpenseForm({ ...expenseForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept: DepartmentAPI) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                )}
                {departments.length === 0 && !isLoadingDepartments && (
                  <p className="mt-1 text-sm text-red-600">
                    No departments found. Please add departments first.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the expense..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpense}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingExpense ? 'Save Changes' : 'Record Expense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reimbursement Modal */}
      {showReimbursementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Reimbursement Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={reimbursementForm.employeeName}
                  onChange={(e) => setReimbursementForm({ ...reimbursementForm, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Dr. Sarah Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  value={reimbursementForm.employeeId}
                  onChange={(e) => setReimbursementForm({ ...reimbursementForm, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="EMP-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={reimbursementForm.category}
                  onChange={(e) => setReimbursementForm({ ...reimbursementForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Training">Training</option>
                  <option value="Travel">Travel</option>
                  <option value="Materials">Materials</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={reimbursementForm.amount}
                  onChange={(e) => setReimbursementForm({ ...reimbursementForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="250"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={reimbursementForm.date}
                  onChange={(e) => setReimbursementForm({ ...reimbursementForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={reimbursementForm.description}
                  onChange={(e) => setReimbursementForm({ ...reimbursementForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the reimbursement request..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReimbursementModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReimbursement}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentExpenses;
