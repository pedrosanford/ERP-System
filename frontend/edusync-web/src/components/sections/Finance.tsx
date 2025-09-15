import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCreditCard, FiPieChart, FiBarChart, FiTarget } from 'react-icons/fi';
import Modal from './finance/Modal';
import ProcessPaymentModal from './finance/ProcessPaymentModal';
import GenerateInvoiceModal from './finance/GenerateInvoiceModal';
import ViewReportsModal from './finance/ViewReportsModal';
import ManageBudgetModal from './finance/ManageBudgetModal';
import AllTransactionsView from './finance/AllTransactionsView';
import FinancialAnalyticsView from './finance/FinancialAnalyticsView';
import ProcessPaymentSection from './finance/ProcessPaymentSection';
import GenerateInvoiceSection from './finance/GenerateInvoiceSection';
import ViewReportsSection from './finance/ViewReportsSection';
import ManageBudgetSection from './finance/ManageBudgetSection';
import AllPaymentsView from './finance/AllPaymentsView';
import AllInvoicesView from './finance/AllInvoicesView';
import AllReportsView from './finance/AllReportsView';
import AllBudgetView from './finance/AllBudgetView';

const Finance: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showFinancialAnalytics, setShowFinancialAnalytics] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);
  const [showAllBudget, setShowAllBudget] = useState(false);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleViewAllTransactions = () => {
    setShowAllTransactions(true);
  };

  const handleBackToFinance = () => {
    setShowAllTransactions(false);
    setShowFinancialAnalytics(false);
    setShowAllPayments(false);
    setShowAllInvoices(false);
    setShowAllReports(false);
    setShowAllBudget(false);
  };

  const handleViewAllAnalytics = () => {
    setShowFinancialAnalytics(true);
  };

  const handleViewAllPayments = () => {
    setShowAllPayments(true);
  };

  const handleViewAllInvoices = () => {
    setShowAllInvoices(true);
  };

  const handleViewAllReports = () => {
    setShowAllReports(true);
  };

  const handleViewAllBudget = () => {
    setShowAllBudget(true);
  };

  // Show All Transactions view if requested
  if (showAllTransactions) {
    return <AllTransactionsView onBack={handleBackToFinance} />;
  }

  // Show Financial Analytics view if requested
  if (showFinancialAnalytics) {
    return <FinancialAnalyticsView onBack={handleBackToFinance} />;
  }

  // Show All Payments view if requested
  if (showAllPayments) {
    return <AllPaymentsView onBack={handleBackToFinance} />;
  }

  // Show All Invoices view if requested
  if (showAllInvoices) {
    return <AllInvoicesView onBack={handleBackToFinance} />;
  }

  // Show All Reports view if requested
  if (showAllReports) {
    return <AllReportsView onBack={handleBackToFinance} />;
  }

  // Show All Budget view if requested
  if (showAllBudget) {
    return <AllBudgetView onBack={handleBackToFinance} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600">Manage financial operations and reporting</p>
        </div>
        <button 
          onClick={() => openModal('processPayment')}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <FiCreditCard className="w-4 h-4" />
          <span>Process Payment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$452,230</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$45,230</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">$323,700</p>
            </div>
            <FiTrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+0.7% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">$128,530</p>
            </div>
            <FiPieChart className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+68% profit margin</p>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
              <button 
                onClick={handleViewAllTransactions}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
              >
                View All Transactions
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tuition Payment</p>
                    <p className="text-sm text-gray-500">John Smith - CS Program</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$3,500</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Course Fee</p>
                    <p className="text-sm text-gray-500">Maria Johnson - Business</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$2,800</p>
                  <p className="text-sm text-gray-500">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiTrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Equipment Purchase</p>
                    <p className="text-sm text-gray-500">Lab Equipment</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-$1,200</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <button 
              onClick={() => openModal('processPayment')}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <FiCreditCard className="w-5 h-5" />
              <span>Process Payment</span>
            </button>
            <button 
              onClick={() => openModal('generateInvoice')}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiDollarSign className="w-5 h-5" />
              <span>Generate Invoice</span>
            </button>
            <button 
              onClick={() => openModal('viewReports')}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiPieChart className="w-5 h-5" />
              <span>View Reports</span>
            </button>
            <button 
              onClick={() => openModal('manageBudget')}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FiTarget className="w-5 h-5" />
              <span>Manage Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Analytics Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Financial Analytics</h3>
            <button 
              onClick={handleViewAllAnalytics}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
            >
              View All Analytics
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart Placeholder */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiTrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-gray-900">Revenue Trend</h4>
              </div>
              <div className="h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiBarChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Revenue chart will be displayed here</p>
                  <p className="text-sm">Monthly revenue trends and projections</p>
                </div>
              </div>
            </div>

            {/* Expense Breakdown Chart Placeholder */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiPieChart className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Expense Breakdown</h4>
              </div>
              <div className="h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiPieChart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Expense breakdown chart will be displayed here</p>
                  <p className="text-sm">Categorized expense analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics Placeholder */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">$45,230</div>
              <div className="text-sm text-gray-600">This Month's Revenue</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">$28,150</div>
              <div className="text-sm text-gray-600">This Month's Expenses</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">$17,080</div>
              <div className="text-sm text-gray-600">Net Profit This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Sections */}
      <div className="space-y-6">
        <ProcessPaymentSection onViewAll={handleViewAllPayments} />
        <GenerateInvoiceSection onViewAll={handleViewAllInvoices} />
        <ViewReportsSection onViewAll={handleViewAllReports} />
        <ManageBudgetSection onViewAll={handleViewAllBudget} />
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'processPayment'}
        onClose={closeModal}
        title="Process Payment"
        size="md"
      >
        <ProcessPaymentModal isOpen={activeModal === 'processPayment'} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === 'generateInvoice'}
        onClose={closeModal}
        title="Generate Invoice"
        size="lg"
      >
        <GenerateInvoiceModal isOpen={activeModal === 'generateInvoice'} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === 'viewReports'}
        onClose={closeModal}
        title="Financial Reports"
        size="xl"
      >
        <ViewReportsModal isOpen={activeModal === 'viewReports'} onClose={closeModal} />
      </Modal>

      <Modal
        isOpen={activeModal === 'manageBudget'}
        onClose={closeModal}
        title="Budget Management"
        size="xl"
      >
        <ManageBudgetModal isOpen={activeModal === 'manageBudget'} onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Finance;
