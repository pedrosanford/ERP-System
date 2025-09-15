import React, { useState } from 'react';
import { FiFileText, FiUser, FiDollarSign, FiCalendar, FiCheck, FiX, FiPlus, FiSearch, FiDownload } from 'react-icons/fi';

interface GenerateInvoiceSectionProps {
  onViewAll: () => void;
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

const GenerateInvoiceSection: React.FC<GenerateInvoiceSectionProps> = ({ onViewAll }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    studentId: '',
    invoiceNumber: '',
    description: '',
    dueDate: '',
    items: [{ description: '', amount: '' }]
  });

  // Mock data
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
    }
  ];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invoice generation
    console.log('Generating invoice:', newInvoice);
    setShowNewInvoiceForm(false);
    setNewInvoice({ studentId: '', invoiceNumber: '', description: '', dueDate: '', items: [{ description: '', amount: '' }] });
  };

  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', amount: '' }]
    }));
  };

  const removeInvoiceItem = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateInvoiceItem = (index: number, field: 'description' | 'amount', value: string) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

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

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiFileText className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Invoice Management</h3>
              <p className="text-sm text-gray-600">Generate and manage student invoices</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowNewInvoiceForm(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Invoice</span>
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
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalInvoices}</div>
            <div className="text-sm text-green-600">Total Invoices</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <div className="text-sm text-red-600">Overdue</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${totalAmount.toLocaleString()}</div>
            <div className="text-sm text-blue-600">Total Amount</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
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

        {/* Recent Invoices */}
        <div className="space-y-3">
          {filteredInvoices.slice(0, 3).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                  <div className="text-sm text-gray-600">{invoice.studentName} • {invoice.program}</div>
                  <div className="text-sm text-gray-500">{invoice.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">${invoice.amount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* New Invoice Form Modal */}
        {showNewInvoiceForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowNewInvoiceForm(false)} />
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Generate New Invoice</h3>
                  <button
                    onClick={() => setShowNewInvoiceForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmitInvoice} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={newInvoice.studentId}
                          onChange={(e) => setNewInvoice(prev => ({ ...prev, studentId: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter student ID"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                      <input
                        type="text"
                        value={newInvoice.invoiceNumber}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="INV-2024-001"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Invoice description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Items</label>
                    <div className="space-y-3">
                      {newInvoice.items.map((item, index) => (
                        <div key={index} className="flex space-x-3 items-end">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Item description"
                            />
                          </div>
                          <div className="w-32">
                            <div className="relative">
                              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => updateInvoiceItem(index, 'amount', e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                              />
                            </div>
                          </div>
                          {newInvoice.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeInvoiceItem(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addInvoiceItem}
                        className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNewInvoiceForm(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Generate Invoice
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

export default GenerateInvoiceSection;
