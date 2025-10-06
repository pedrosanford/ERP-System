import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiActivity, FiPlus } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import financeService, { type Transaction, type FinanceStats } from '../../../services/financeService';
import studentService, { type Student as StudentAPI } from '../../../services/studentService';

const FinanceOverview: React.FC = () => {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    
    // Students list for dropdown
    const [students, setStudents] = useState<StudentAPI[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    // Form states for adding transaction
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        transactionId: '',
        type: 'INCOME' as 'INCOME' | 'EXPENSE',
        amount: '',
        category: '',
        subCategory: '',
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        description: '',
        reference: '',
        status: 'PENDING' as 'PENDING' | 'COMPLETED' | 'CANCELLED',
        paymentMethod: '',
        notes: '',
        studentId: '', // Link to student
    });

    useEffect(() => {
        fetchData();
        fetchStudents();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [statsData, transactionsData] = await Promise.all([
                financeService.getStats(),
                financeService.getAllTransactions(), // Changed to get ALL transactions
            ]);
            setStats(statsData);
            // Sort transactions by date (newest first)
            const sortedTransactions = transactionsData.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            setTransactions(sortedTransactions);
        } catch (err: any) {
            console.error('Failed to fetch finance data:', err);
            setError(err.message || 'Failed to load finance data');
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchStudents = async () => {
        setIsLoadingStudents(true);
        try {
            const studentsData = await studentService.getAllStudents();
            // Only show active students
            setStudents(studentsData.filter(s => s.status === 'ACTIVE'));
        } catch (err: any) {
            console.error('Failed to fetch students:', err);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const transactionData: Transaction = {
                transactionId: formData.transactionId,
                type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category,
                subCategory: formData.subCategory || undefined,
                date: formData.date,
                description: formData.description,
                reference: formData.reference || undefined,
                status: formData.status,
                paymentMethod: formData.paymentMethod || undefined,
                notes: formData.notes || undefined,
                studentId: formData.studentId ? parseInt(formData.studentId) : undefined,
            };

            await financeService.createTransaction(transactionData);
            await fetchData(); // Refresh data
            handleClose();
        } catch (err: any) {
            console.error('Failed to create transaction:', err);
            setSubmitError(err.message || 'Failed to create transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowAddModal(false);
        setSubmitError(null);
        setFormData({
            transactionId: '',
            type: 'INCOME',
            amount: '',
            category: '',
            subCategory: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            reference: '',
            status: 'PENDING',
            paymentMethod: '',
            notes: '',
            studentId: '',
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin h-8 w-8 text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <FiDollarSign className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Finance Overview</h2>
                        <p className="text-sm text-gray-600">Monitor revenue, expenses, and transactions</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Transaction
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Total Revenue</span>
                            <FiTrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <span className={`font-medium ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                            </span>
                            <span className="text-gray-600 ml-1">this month</span>
                        </div>
                    </div>

                    {/* Total Expenses */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Total Expenses</span>
                            <FiTrendingDown className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats.totalExpenses)}
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <span className={`font-medium ${stats.expenseGrowth >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {stats.expenseGrowth >= 0 ? '+' : ''}{stats.expenseGrowth.toFixed(1)}%
                            </span>
                            <span className="text-gray-600 ml-1">this month</span>
                        </div>
                    </div>

                    {/* Net Profit */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Net Profit</span>
                            <FiActivity className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats.netProfit)}
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                            <span className="text-gray-600">
                                Margin: <span className="font-medium text-blue-600">{stats.profitMargin.toFixed(1)}%</span>
                            </span>
                        </div>
                    </div>

                    {/* Total Balance */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Total Balance</span>
                            <FiDollarSign className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(stats.totalBalance)}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                            <span>{stats.totalAccounts} active accounts</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    {transactions.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            <p>No transactions found</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((transaction) => {
                                    const student = students.find(s => s.id === transaction.studentId);
                                    return (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {transaction.transactionId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.category}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {student ? (
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                                        {student.firstName} {student.lastName}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Transaction</h2>
                        {submitError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {submitError}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Transaction ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="transactionId"
                                        value={formData.transactionId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="TXN123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="INCOME">Income</option>
                                        <option value="EXPENSE">Expense</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        step="0.01"
                                        min="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="1000.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Tuition Fees"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sub-Category
                                    </label>
                                    <input
                                        type="text"
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Grade 1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Link to Student (Optional)
                                    </label>
                                    <select
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">-- No student --</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.firstName} {student.lastName} ({student.studentId})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Select if this transaction is related to a specific student
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <input
                                        type="text"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Bank Transfer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reference
                                    </label>
                                    <input
                                        type="text"
                                        name="reference"
                                        value={formData.reference}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="INV-001"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Tuition fee payment for October 2025"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="Additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin h-4 w-4" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Transaction</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceOverview;

