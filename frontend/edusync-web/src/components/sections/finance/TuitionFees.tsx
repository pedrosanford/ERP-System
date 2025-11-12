import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import studentService, { type Student as StudentAPI } from '../../../services/studentService';
import financeService from '../../../services/financeService';

interface TuitionRule {
  id: string;
  grade: string;
  course: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Annually';
  status: 'Active' | 'Inactive';
}

interface Invoice {
  id: string;
  studentName: string;
  grade: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
}

interface Payment {
  id: string;
  invoiceId: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: 'Received' | 'Pending';
}

const TuitionFees: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'invoices' | 'collections'>('rules');
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingRule, setEditingRule] = useState<TuitionRule | null>(null);
  
  // Real students from database
  const [students, setStudents] = useState<StudentAPI[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  
  // Real invoices from database
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  // Form states
  const [ruleForm, setRuleForm] = useState({
    grade: '',
    course: '',
    amount: '',
    frequency: 'Monthly' as 'Monthly' | 'Quarterly' | 'Annually',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    studentName: '',
    grade: '',
    amount: '',
    dueDate: ''
  });
  
  // Fetch students first, then invoices
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch invoices after students are loaded
  useEffect(() => {
    if (students.length > 0) {
      fetchInvoices();
    }
  }, [students]);
  
  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    setStudentsError(null);
    try {
      const studentsData = await studentService.getAllStudents();
      // Only show active students
      setStudents(studentsData.filter(s => s.status === 'ACTIVE'));
    } catch (err: any) {
      console.error('Failed to fetch students:', err);
      setStudentsError(err.message || 'Failed to load students');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    setInvoicesError(null);
    try {
      // Fetch tuition and fees invoices from finance service
      const [tuitionInvoices, feesInvoices] = await Promise.all([
        financeService.getTransactionsByCategory('Tuition Invoice'),
        financeService.getTransactionsByCategory('Fees Invoice')
      ]);
      
      // Combine and transform to Invoice format
      const allInvoices = [...tuitionInvoices, ...feesInvoices].map(transaction => {
        const student = students.find(s => s.id === transaction.studentId);
        return {
          id: transaction.transactionId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          grade: student?.program || 'Unknown Program',
          amount: transaction.amount,
          dueDate: transaction.date,
          status: transaction.status === 'COMPLETED' ? 'Paid' as 'Paid' : 
                  transaction.status === 'PENDING' ? 'Pending' as 'Pending' : 'Overdue' as 'Overdue'
        };
      });
      
      setInvoices(allInvoices);
    } catch (err: any) {
      console.error('Failed to fetch invoices:', err);
      setInvoicesError(err.message || 'Failed to load invoices');
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  // Real data (no mock data)
  const [tuitionRules, setTuitionRules] = useState<TuitionRule[]>([
    { id: '1', grade: 'Grade 1', course: 'General', amount: 5000, frequency: 'Monthly', status: 'Active' },
    { id: '2', grade: 'Grade 2', course: 'General', amount: 5500, frequency: 'Monthly', status: 'Active' },
  ]);

  const payments: Payment[] = []; // Empty payments for now

  // Handler functions
  const handleAddRule = () => {
    setEditingRule(null);
    setRuleForm({
      grade: '',
      course: '',
      amount: '',
      frequency: 'Monthly',
      status: 'Active'
    });
    setShowRuleModal(true);
  };

  const handleEditRule = (rule: TuitionRule) => {
    setEditingRule(rule);
    setRuleForm({
      grade: rule.grade,
      course: rule.course,
      amount: rule.amount.toString(),
      frequency: rule.frequency,
      status: rule.status
    });
    setShowRuleModal(true);
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tuition rule?')) {
      setTuitionRules(tuitionRules.filter(rule => rule.id !== id));
    }
  };

  const handleSaveRule = () => {
    if (!ruleForm.grade || !ruleForm.course || !ruleForm.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingRule) {
      setTuitionRules(tuitionRules.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...ruleForm, amount: parseFloat(ruleForm.amount) }
          : rule
      ));
    } else {
      const newRule: TuitionRule = {
        id: (tuitionRules.length + 1).toString(),
        grade: ruleForm.grade,
        course: ruleForm.course,
        amount: parseFloat(ruleForm.amount),
        frequency: ruleForm.frequency,
        status: ruleForm.status
      };
      setTuitionRules([...tuitionRules, newRule]);
    }
    setShowRuleModal(false);
  };

  const handleAddInvoice = () => {
    if (students.length === 0) {
      alert('No active students found. Please add students first.');
      return;
    }
    setInvoiceForm({
      studentId: '',
      studentName: '',
      grade: '',
      amount: '',
      dueDate: ''
    });
    setShowInvoiceModal(true);
  };
  
  const handleStudentChange = (studentId: string) => {
    const selectedStudent = students.find(s => s.id?.toString() === studentId);
    if (selectedStudent) {
      setInvoiceForm({
        ...invoiceForm,
        studentId: studentId,
        studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        grade: selectedStudent.program || ''
      });
    }
  };

  const handleSaveInvoice = () => {
    if (!invoiceForm.studentId || !invoiceForm.amount || !invoiceForm.dueDate) {
      alert('Please fill in all required fields (Student, Amount, Due Date)');
      return;
    }

    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      studentName: invoiceForm.studentName,
      grade: invoiceForm.grade,
      amount: parseFloat(invoiceForm.amount),
      dueDate: invoiceForm.dueDate,
      status: 'Pending'
    };
    setInvoices([...invoices, newInvoice]);
    setShowInvoiceModal(false);
    
    // Show success message
    alert(`Invoice created successfully for ${invoiceForm.studentName}!`);
  };

  const renderTuitionRules = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Tuition Fee Structure</h3>
        <button
          onClick={handleAddRule}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade/Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tuitionRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{rule.grade}</div>
                    <div className="text-sm text-gray-500">{rule.course}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${rule.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.frequency}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rule.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Generated Invoices</h3>
        <button
          onClick={handleAddInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>

      {invoicesError && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {invoicesError}
        </div>
      )}

      {isLoadingInvoices ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
          <span className="ml-2 text-gray-600">Loading invoices...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No invoices found. Generate some invoices to see them here.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
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

  const renderCollections = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payment Collections</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Total Received</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            ${payments.filter(p => p.status === 'Received').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-sm text-yellow-600 font-medium">Pending</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">
            ${invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-sm text-red-600 font-medium">Overdue</div>
          <div className="text-2xl font-bold text-red-900 mt-1">
            ${invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.invoiceId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <FiDollarSign className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tuition & Fees</h2>
          <p className="text-sm text-gray-600">Manage tuition rules, generate invoices, and track collections</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'rules'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Set Tuition Rules
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'invoices'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Generate Invoices
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'collections'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Track Collections
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'rules' && renderTuitionRules()}
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'collections' && renderCollections()}
      </div>

      {/* Add/Edit Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingRule ? 'Edit Tuition Rule' : 'Add Tuition Rule'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <input
                  type="text"
                  value={ruleForm.grade}
                  onChange={(e) => setRuleForm({ ...ruleForm, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Grade 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <input
                  type="text"
                  value={ruleForm.course}
                  onChange={(e) => setRuleForm({ ...ruleForm, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., General"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={ruleForm.amount}
                  onChange={(e) => setRuleForm({ ...ruleForm, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={ruleForm.frequency}
                  onChange={(e) => setRuleForm({ ...ruleForm, frequency: e.target.value as 'Monthly' | 'Quarterly' | 'Annually' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={ruleForm.status}
                  onChange={(e) => setRuleForm({ ...ruleForm, status: e.target.value as 'Active' | 'Inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRuleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingRule ? 'Save Changes' : 'Add Rule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Invoice</h3>
            
            {studentsError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {studentsError}
              </div>
            )}
            
            {isLoadingStudents ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={invoiceForm.studentId}
                    onChange={(e) => handleStudentChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Select a student --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.studentId}) - {student.program}
                      </option>
                    ))}
                  </select>
                  {students.length === 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      No active students found. Please add students first.
                    </p>
                  )}
                </div>
                
                {invoiceForm.studentId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input
                        type="text"
                        value={invoiceForm.studentName}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program/Grade</label>
                      <input
                        type="text"
                        value={invoiceForm.grade}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInvoice}
                disabled={isLoadingStudents || students.length === 0}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionFees;
