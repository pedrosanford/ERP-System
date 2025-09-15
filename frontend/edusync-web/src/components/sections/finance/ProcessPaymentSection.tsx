import React, { useState } from 'react';
import { FiCreditCard, FiUser, FiDollarSign, FiCalendar, FiCheck, FiX, FiPlus, FiSearch } from 'react-icons/fi';

interface ProcessPaymentSectionProps {
  onViewAll: () => void;
}

interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  amount: number;
  description: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  dueDate: string;
  processedDate?: string;
}

const ProcessPaymentSection: React.FC<ProcessPaymentSectionProps> = ({ onViewAll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    studentId: '',
    amount: '',
    paymentMethod: 'credit_card',
    description: '',
    dueDate: ''
  });

  // Mock data
  const payments: PaymentRecord[] = [
    {
      id: 'PAY-001',
      studentId: 'STU-001',
      studentName: 'John Smith',
      program: 'Computer Science',
      amount: 3500,
      description: 'Tuition Payment - Spring 2024',
      paymentMethod: 'Credit Card',
      status: 'completed',
      dueDate: '2024-01-15',
      processedDate: '2024-01-15'
    },
    {
      id: 'PAY-002',
      studentId: 'STU-002',
      studentName: 'Maria Johnson',
      program: 'Business Administration',
      amount: 2800,
      description: 'Course Fee - Advanced Marketing',
      paymentMethod: 'Bank Transfer',
      status: 'pending',
      dueDate: '2024-01-20'
    },
    {
      id: 'PAY-003',
      studentId: 'STU-003',
      studentName: 'David Wilson',
      program: 'Engineering',
      amount: 4200,
      description: 'Semester Fee - Fall 2024',
      paymentMethod: 'Debit Card',
      status: 'failed',
      dueDate: '2024-01-18'
    }
  ];

  const filteredPayments = payments.filter(payment =>
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement payment processing
    console.log('Processing payment:', newPayment);
    setShowNewPaymentForm(false);
    setNewPayment({ studentId: '', amount: '', paymentMethod: 'credit_card', description: '', dueDate: '' });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalPending = payments.filter(p => p.status === 'pending').length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiCreditCard className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Payment Processing</h3>
              <p className="text-sm text-gray-600">Manage student payments and transactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewPaymentForm(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Payment</span>
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
            <div className="text-2xl font-bold text-blue-600">{payments.length}</div>
            <div className="text-sm text-blue-600">Total Payments</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${totalAmount.toLocaleString()}</div>
            <div className="text-sm text-green-600">Total Amount</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Recent Payments */}
        <div className="space-y-3">
          {filteredPayments.slice(0, 3).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{payment.studentName}</div>
                  <div className="text-sm text-gray-600">{payment.program} • {payment.studentId}</div>
                  <div className="text-sm text-gray-500">{payment.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">${payment.amount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{payment.paymentMethod}</div>
                <div className="mt-1">{getStatusBadge(payment.status)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* New Payment Form Modal */}
        {showNewPaymentForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowNewPaymentForm(false)} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Process New Payment</h3>
                  <button
                    onClick={() => setShowNewPaymentForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={newPayment.studentId}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, studentId: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter student ID"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={newPayment.paymentMethod}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newPayment.description}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Payment description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={newPayment.dueDate}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewPaymentForm(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Process Payment
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

export default ProcessPaymentSection;
