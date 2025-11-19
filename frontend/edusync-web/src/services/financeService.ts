// Use relative URLs - Vite proxy will handle routing to Gateway
const FINANCE_SERVICE_URL = '/api/finance';

export interface Transaction {
    id?: number;
    transactionId: string;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    category: string;
    subCategory?: string;
    date: string; // ISO date format
    description: string;
    reference?: string;
    accountId?: number;
    studentId?: number;
    staffId?: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    paymentMethod?: string;
    createdBy?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Account {
    id?: number;
    name: string;
    accountNumber: string;
    type: 'CASH' | 'BANK' | 'CREDIT_CARD' | 'PAYPAL' | 'OTHER';
    balance: number;
    currency: string;
    bankName?: string;
    branch?: string;
    description?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
    createdAt?: string;
    updatedAt?: string;
}

export interface Budget {
    id?: number;
    name: string;
    category: string;
    amount: number;
    spent: number;
    period: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    startDate: string; // ISO date format
    endDate: string; // ISO date format
    description?: string;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    alertThreshold?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface FinanceStats {
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    totalExpenses: number;
    monthlyExpenses: number;
    expenseGrowth: number;
    netProfit: number;
    profitMargin: number;
    totalBalance: number;
    totalTransactions: number;
    totalAccounts: number;
    activeBudgets: number;
}

const financeService = {
    // Stats
    getStats: async (): Promise<FinanceStats> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/stats`);
        if (!response.ok) {
            throw new Error(`Failed to fetch finance stats: ${response.statusText}`);
        }
        return response.json();
    },

    // Transactions
    getAllTransactions: async (): Promise<Transaction[]> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions`);
        if (!response.ok) {
            throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }
        return response.json();
    },

    getTransactionById: async (id: number): Promise<Transaction> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch transaction: ${response.statusText}`);
        }
        return response.json();
    },

    getTransactionsByType: async (type: 'INCOME' | 'EXPENSE'): Promise<Transaction[]> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/type/${type}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch transactions by type: ${response.statusText}`);
        }
        return response.json();
    },

    getTransactionsByStatus: async (status: string): Promise<Transaction[]> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/status/${status}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch transactions by status: ${response.statusText}`);
        }
        return response.json();
    },

    getTransactionsByCategory: async (category: string): Promise<Transaction[]> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/category/${category}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch transactions by category: ${response.statusText}`);
        }
        return response.json();
    },

    getRecentTransactions: async (): Promise<Transaction[]> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/recent`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recent transactions: ${response.statusText}`);
        }
        return response.json();
    },

    createTransaction: async (transaction: Transaction): Promise<Transaction> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to create transaction: ${response.statusText}`);
        }
        return response.json();
    },

    updateTransaction: async (id: number, transaction: Transaction): Promise<Transaction> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update transaction: ${response.statusText}`);
        }
        return response.json();
    },

    updateTransactionStatus: async (id: number, status: string): Promise<Transaction> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/${id}/status?status=${status}`, {
            method: 'PUT',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update transaction status: ${response.statusText}`);
        }
        return response.json();
    },

    deleteTransaction: async (id: number): Promise<void> => {
        const response = await fetch(`${FINANCE_SERVICE_URL}/transactions/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete transaction: ${response.statusText}`);
        }
    },
};

export default financeService;

