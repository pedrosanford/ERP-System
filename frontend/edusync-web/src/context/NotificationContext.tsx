import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import studentService from '../services/studentService';
import financeService from '../services/financeService';
import { FiCreditCard, FiUserPlus, FiActivity } from 'react-icons/fi';

export interface Notification {
  id: string;
  type: 'transaction' | 'enrollment' | 'activity';
  title: string;
  description: string;
  timestamp: string;
  icon: ReactNode;
  color: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const refreshNotifications = async () => {
    try {
      const [transactions, students] = await Promise.all([
        financeService.getRecentTransactions().catch(() => []),
        studentService.getAllStudents().catch(() => [])
      ]);

      const newNotifications: Notification[] = [];

      // Add recent transactions (last 5)
      transactions.slice(0, 5).forEach((tx) => {
        const txDate = new Date(tx.date);
        newNotifications.push({
          id: `tx-${tx.id}`,
          type: 'transaction',
          title: tx.type === 'INCOME' 
            ? `Payment received: $${tx.amount.toLocaleString()}`
            : `Expense recorded: $${tx.amount.toLocaleString()}`,
          description: tx.description || tx.category,
          timestamp: formatTimeAgo(txDate),
          icon: <FiCreditCard />,
          color: tx.type === 'INCOME' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50',
          read: false,
          createdAt: txDate
        });
      });

      // Add recent student enrollments (last 3)
      const recentEnrollments = students
        .filter(s => s.status === 'ACTIVE' && s.enrollmentDate)
        .sort((a, b) => {
          const dateA = a.enrollmentDate ? new Date(a.enrollmentDate).getTime() : 0;
          const dateB = b.enrollmentDate ? new Date(b.enrollmentDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 3);
      
      recentEnrollments.forEach((student) => {
        const enrollDate = new Date(student.enrollmentDate);
        newNotifications.push({
          id: `enroll-${student.id}`,
          type: 'enrollment',
          title: 'New student enrolled',
          description: `${student.firstName} ${student.lastName} enrolled in ${student.program}`,
          timestamp: formatTimeAgo(enrollDate),
          icon: <FiUserPlus />,
          color: 'text-blue-600 bg-blue-50',
          read: false,
          createdAt: enrollDate
        });
      });

      // Sort by date (newest first)
      newNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Load read status from localStorage
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      newNotifications.forEach(notif => {
        notif.read = readNotifications.includes(notif.id);
      });

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    refreshNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
    
    // Save to localStorage
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readNotifications.includes(id)) {
      readNotifications.push(id);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    localStorage.setItem('readNotifications', JSON.stringify(allIds));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

