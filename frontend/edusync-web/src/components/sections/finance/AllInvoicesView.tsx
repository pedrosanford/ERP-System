import React, { useState } from 'react';
import { FiArrowLeft, FiSearch, FiDownload, FiEye, FiEdit, FiTrash2, FiFileText, FiUser, FiDollarSign, FiCalendar, FiPlus } from 'react-icons/fi';

interface AllInvoicesViewProps {
  onBack: () => void;
}

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  program: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdDate: string;
  items: { description: string; amount: number }[];
}

const AllInvoicesView: React.FC<AllInvoicesViewProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  // Mock data - расширенный список
  const invoices: InvoiceRecord[] = [
    {
      id: 'INV-001',
      invoiceNumber: 'INV-2024-001',
      studentId: 'STU-001',
      studentName: 'John Smith',
      program: 'Computer Science',
      amount: 3500,
      description: 'Tuition and fees for Spring 2024',
      dueDate: '2024-02-15',
      status: 'paid',
      createdDate: '2024-01-15',
      items: [
        { description: 'Tuition Fee', amount: 3000 },
        { description: 'Lab Fee', amount: 500 }
      ]
    },
    {
      id: 'INV-002',
      invoiceNumber: 'INV-2024-002',
      studentId: 'STU-002',
      studentName: 'Maria Johnson',
      program: 'Business Administration',
      amount: 2800,
      description: 'Course fees for Advanced Marketing',
      dueDate: '2024-02-20',
      status: 'sent',
      createdDate: '2024-01-18',
      items: [
        { description: 'Course Fee', amount: 2500 },
        { description: 'Materials Fee', amount: 300 }
      ]
    },
    {
      id: 'INV-003',
      invoiceNumber: 'INV-2024-003',
      studentId: 'STU-003',
      studentName: 'David Wilson',
      program: 'Engineering',
      amount: 4200,
      description: 'Semester fees for Fall 2024',
      dueDate: '2024-01-30',
      status: 'overdue',
      createdDate: '2024-01-10',
      items: [
        { description: 'Tuition Fee', amount: 4000 },
        { description: 'Equipment Fee', amount: 200 }
      ]
    },
    {
      id: 'INV-004',
      invoiceNumber: 'INV-2024-004',
      studentId: 'STU-004',
      studentName: 'Sarah Brown',
      program: 'Psychology',
      amount: 2100,
      description: 'Lab fees for Research Methods',
      dueDate: '2024-02-10',
      status: 'draft',
      createdDate: '2024-01-20',
      items: [
        { description: 'Lab Fee', amount: 1500 },
        { description: 'Materials Fee', amount: 600 }
      ]
    },
    {
      id: 'INV-005',
      invoiceNumber: 'INV-2024-005',
      studentId: 'STU-005',
      studentName: 'Michael Davis',
      program: 'Chemistry',
      amount: 1800,
      description: 'Equipment fees for Lab Materials',
      dueDate: '2024-02-25',
      status: 'sent',
      createdDate: '2024-01-22',
      items: [
        { description: 'Equipment Fee', amount: 1200 },
        { description: 'Safety Fee', amount: 600 }
      ]
    },
    {
      id: 'INV-006',
      invoiceNumber: 'INV-2024-006',
      studentId: 'STU-006',
      studentName: 'Emily Wilson',
      program: 'Mathematics',
      amount: 2500,
      description: 'Tuition payment for Spring 2024',
      dueDate: '2024-02-05',
      status: 'paid',
      createdDate: '2024-01-12',
      items: [
        { description: 'Tuition Fee', amount: 2500 }
      ]
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
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
      day: 'numeric'
    });
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = filteredInvoices.filter(inv => inv.status === 'overdue').length;
  const draftInvoices = filteredInvoices.filter(inv => inv.status === 'draft').length;

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
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Complete invoice generation and tracking system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewInvoiceForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</div>
          <div className="text-sm text-gray-600">Total Invoices</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
          <div className="text-sm text-gray-600">Paid</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">${totalAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Amount</div>
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
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
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
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FiFileText className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{invoice.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.studentName}</div>
                    <div className="text-sm text-gray-500">{invoice.program} • {invoice.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${invoice.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
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

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedInvoice(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                    <p className="text-sm text-gray-900">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <p className="text-sm text-gray-900">{selectedInvoice.studentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student Name</label>
                    <p className="text-sm text-gray-900">{selectedInvoice.studentName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Program</label>
                    <p className="text-sm text-gray-900">{selectedInvoice.program}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-sm font-medium text-gray-900">${selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedInvoice.dueDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedInvoice.createdDate)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Items</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">Total</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">${selectedInvoice.amount.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
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

export default AllInvoicesView;
