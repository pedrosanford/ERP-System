import React, { useState } from 'react';
import { FiArrowLeft, FiSearch, FiFilter, FiDownload, FiEye, FiEdit, FiTrash2, FiDollarSign, FiCreditCard, FiTrendingDown } from 'react-icons/fi';

interface Transaction {
  id: string;
  type: 'payment' | 'expense' | 'refund' | 'invoice';
  description: string;
  studentName?: string;
  program?: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod?: string;
  reference?: string;
}

interface AllTransactionsViewProps {
  onBack: () => void;
}

const AllTransactionsView: React.FC<AllTransactionsViewProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Mock data - в реальном приложении это будет загружаться с API
  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'payment',
      description: 'Tuition Payment',
      studentName: 'John Smith',
      program: 'Computer Science',
      amount: 3500,
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      paymentMethod: 'Credit Card',
      reference: 'PAY-2024-001'
    },
    {
      id: 'TXN-002',
      type: 'payment',
      description: 'Course Fee',
      studentName: 'Maria Johnson',
      program: 'Business Administration',
      amount: 2800,
      date: '2024-01-15T14:20:00Z',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      reference: 'PAY-2024-002'
    },
    {
      id: 'TXN-003',
      type: 'expense',
      description: 'Equipment Purchase',
      amount: -1200,
      date: '2024-01-14T09:15:00Z',
      status: 'completed',
      paymentMethod: 'Purchase Order',
      reference: 'EXP-2024-001'
    },
    {
      id: 'TXN-004',
      type: 'payment',
      description: 'Semester Fee',
      studentName: 'David Wilson',
      program: 'Engineering',
      amount: 4200,
      date: '2024-01-14T16:45:00Z',
      status: 'pending',
      paymentMethod: 'Debit Card',
      reference: 'PAY-2024-003'
    },
    {
      id: 'TXN-005',
      type: 'refund',
      description: 'Course Withdrawal Refund',
      studentName: 'Sarah Brown',
      program: 'Psychology',
      amount: -1500,
      date: '2024-01-13T11:30:00Z',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      reference: 'REF-2024-001'
    },
    {
      id: 'TXN-006',
      type: 'expense',
      description: 'Software License',
      amount: -800,
      date: '2024-01-13T08:00:00Z',
      status: 'completed',
      paymentMethod: 'Credit Card',
      reference: 'EXP-2024-002'
    },
    {
      id: 'TXN-007',
      type: 'payment',
      description: 'Lab Fee',
      studentName: 'Michael Davis',
      program: 'Chemistry',
      amount: 650,
      date: '2024-01-12T13:20:00Z',
      status: 'failed',
      paymentMethod: 'Credit Card',
      reference: 'PAY-2024-004'
    },
    {
      id: 'TXN-008',
      type: 'invoice',
      description: 'Corporate Training Invoice',
      studentName: 'ABC Corporation',
      program: 'Professional Development',
      amount: 5000,
      date: '2024-01-12T10:00:00Z',
      status: 'completed',
      paymentMethod: 'Invoice',
      reference: 'INV-2024-001'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <FiDollarSign className="w-5 h-5 text-green-600" />;
      case 'expense':
        return <FiTrendingDown className="w-5 h-5 text-red-600" />;
      case 'refund':
        return <FiCreditCard className="w-5 h-5 text-blue-600" />;
      case 'invoice':
        return <FiDollarSign className="w-5 h-5 text-purple-600" />;
      default:
        return <FiDollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>
          <p className="text-gray-600">Complete transaction history and management</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <FiFilter className="w-4 h-4" />
            <span>Advanced Filter</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</div>
          <div className="text-sm text-gray-600">Total Transactions</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">${totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Net Amount</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {filteredTransactions.filter(t => t.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredTransactions.filter(t => t.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="expense">Expenses</option>
              <option value="refund">Refunds</option>
              <option value="invoice">Invoices</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student/Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.reference}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {transaction.studentName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.program || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-primary-600 hover:text-primary-900 transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedTransaction(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reference</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className={`text-sm font-medium ${
                      selectedTransaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedTransaction.amount >= 0 ? '+' : ''}${selectedTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedTransaction.date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student/Client</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.studentName || 'N/A'}</p>
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

export default AllTransactionsView;
