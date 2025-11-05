import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiBookOpen,
  FiDollarSign,
  FiUserCheck,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiPlus,
  FiCreditCard,
  FiActivity,
  FiBarChart2
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import studentService, { type Student } from '../services/studentService';
import hrService from '../services/hrService';
import financeService, { type Transaction, type FinanceStats } from '../services/financeService';

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalStaff: number;
  activeStaff: number;
  departments: number;
  averageSalary: number;
  financeStats?: FinanceStats;
  newEnrollments: number;
  graduatedStudents: number;
}

interface ActivityItem {
  id: string;
  type: 'student' | 'payment' | 'course' | 'staff' | 'transaction';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalStaff: 0,
    activeStaff: 0,
    departments: 0,
    averageSalary: 0,
    newEnrollments: 0,
    graduatedStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<{
    revenueExpense: Array<{ month: string; revenue: number; expenses: number }>;
    studentGrowth: Array<{ month: string; students: number }>;
    programDistribution: Array<{ name: string; value: number }>;
  }>({
    revenueExpense: [],
    studentGrowth: [],
    programDistribution: []
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [studentStats, hrStats, financeStatsData, transactions, students] = await Promise.all([
        studentService.getStudentStats(),
        hrService.getHrStats(),
        financeService.getStats().catch(() => null),
        financeService.getRecentTransactions().catch(() => []),
        studentService.getAllStudents().catch(() => [])
      ]);

      setStats({
        totalStudents: studentStats.totalStudents || 0,
        activeStudents: studentStats.activeStudents || 0,
        totalStaff: hrStats.totalStaff || 0,
        activeStaff: hrStats.activeStaff || 0,
        departments: hrStats.departments || 0,
        averageSalary: hrStats.averageSalary || 0,
        financeStats: financeStatsData || undefined,
        newEnrollments: studentStats.newEnrollments || 0,
        graduatedStudents: studentStats.graduatedStudents || 0
      });

      // Build activity feed from real data
      const activities: ActivityItem[] = [];
      
      // Add recent transactions
      transactions.slice(0, 3).forEach((tx) => {
        activities.push({
          id: `tx-${tx.id}`,
          type: 'transaction',
          title: tx.type === 'INCOME' 
            ? `Payment received: $${tx.amount.toLocaleString()}`
            : `Expense recorded: $${tx.amount.toLocaleString()}`,
          description: tx.description || tx.category,
          timestamp: formatTimeAgo(new Date(tx.date)),
          icon: <FiCreditCard />,
          color: tx.type === 'INCOME' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        });
      });

      // Add recent student enrollments
      const recentEnrollments = students
        .filter(s => s.status === 'ACTIVE')
        .sort((a, b) => {
          const dateA = a.enrollmentDate ? new Date(a.enrollmentDate).getTime() : 0;
          const dateB = b.enrollmentDate ? new Date(b.enrollmentDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 2);
      
      recentEnrollments.forEach((student) => {
        activities.push({
          id: `student-${student.id}`,
          type: 'student',
          title: `New student enrolled: ${student.firstName} ${student.lastName}`,
          description: `Program: ${student.program}`,
          timestamp: student.enrollmentDate 
            ? formatTimeAgo(new Date(student.enrollmentDate))
            : 'Recently',
          icon: <FiUsers />,
          color: 'text-blue-600 bg-blue-50'
        });
      });

      // Sort activities by timestamp (most recent first)
      // Note: In production, you'd parse actual dates for proper sorting

      setRecentActivities(activities.slice(0, 5));

      // Prepare chart data
      prepareChartData(transactions, students, studentStats.totalStudents || 0);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const prepareChartData = (transactions: Transaction[], students: Student[], totalStudents: number) => {
    // Prepare revenue/expense data for last 6 months
    const now = new Date();
    const months: Array<{ month: string; revenue: number; expenses: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: 0,
        expenses: 0
      });
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();
      
      // Find the corresponding month in our chart data
      const monthIndex = months.findIndex((_, idx) => {
        const chartDate = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
        return chartDate.getMonth() === txMonth && chartDate.getFullYear() === txYear;
      });
      
      if (monthIndex !== -1) {
        if (tx.type === 'INCOME' && tx.status === 'COMPLETED') {
          months[monthIndex].revenue += tx.amount;
        } else if (tx.type === 'EXPENSE' && tx.status === 'COMPLETED') {
          months[monthIndex].expenses += tx.amount;
        }
      }
    });

    // Prepare student growth data (simulated based on current count)
    const studentGrowthData = months.map((m, index) => ({
      month: m.month,
      students: Math.max(0, totalStudents - (5 - index) * Math.floor(totalStudents / 6))
    }));

    // Prepare program distribution data
    const programCounts: Record<string, number> = {};
    students.forEach(s => {
      programCounts[s.program] = (programCounts[s.program] || 0) + 1;
    });
    const programData = Object.entries(programCounts).map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value
    }));

    setChartData({
      revenueExpense: months,
      studentGrowth: studentGrowthData.length > 0 ? studentGrowthData : months.map(m => ({ month: m.month, students: 0 })),
      programDistribution: programData.length > 0 ? programData : [{ name: 'No Data', value: 1 }]
    });
  };

  const handleSectionNavigation = (section: string) => {
    // Dispatch custom event to communicate with Layout
    const event = new CustomEvent('dashboard-navigate', { detail: section });
    window.dispatchEvent(event);
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'add-student':
        handleSectionNavigation('students');
        break;
      case 'create-course':
        // Navigate to settings or create modal for courses
        handleSectionNavigation('settings');
        break;
      case 'process-payment':
        handleSectionNavigation('finance');
        break;
      case 'generate-report':
        // Navigate to finance for reports or create reports section
        handleSectionNavigation('finance');
        break;
    }
  };

  const handleViewAllActivities = () => {
    // Navigate to finance to see all transactions
    handleSectionNavigation('finance');
  };

  return (
    <div className="space-y-6">
      {/* Stats grid - улучшенный дизайн с трендами */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  stats.totalStudents.toLocaleString()
                )}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-green-600">
                  {stats.activeStudents} active
                </span>
                {stats.newEnrollments > 0 && (
                  <span className="flex items-center text-xs text-blue-600">
                    <FiTrendingUp className="w-3 h-3 mr-1" />
                    +{stats.newEnrollments} new
                  </span>
                )}
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Departments</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  stats.departments
                )}
              </p>
              <span className="text-xs font-medium text-green-600">All active</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FiBookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Revenue / Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {stats.financeStats ? 'Monthly Revenue' : 'Avg Salary'}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? (
                  <span className="inline-block w-16 h-6 bg-gray-200 animate-pulse rounded"></span>
                ) : stats.financeStats ? (
                  formatCurrency(stats.financeStats.monthlyRevenue)
                ) : (
                  formatCurrency(stats.averageSalary)
                )}
              </p>
              <div className="flex items-center space-x-2">
                {stats.financeStats && stats.financeStats.revenueGrowth !== 0 && (
                  <span className={`flex items-center text-xs font-medium ${
                    stats.financeStats.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.financeStats.revenueGrowth > 0 ? (
                      <FiTrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(stats.financeStats.revenueGrowth).toFixed(1)}%
                  </span>
                )}
                {!stats.financeStats && (
                  <span className="text-xs text-gray-500">Monthly average</span>
                )}
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Staff Members */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Staff Members</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {loading ? (
                  <span className="inline-block w-8 h-6 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  stats.totalStaff
                )}
              </p>
              <span className="text-xs font-medium text-green-600">
                {stats.activeStaff} active
              </span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FiUserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Financial Metrics Row */}
      {stats.financeStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.financeStats.totalRevenue)}
                </p>
              </div>
              <FiTrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Expenses</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(stats.financeStats.totalExpenses)}
                </p>
              </div>
              <FiTrendingDown className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Net Profit</p>
                <p className={`text-xl font-bold ${
                  stats.financeStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(stats.financeStats.netProfit)}
                </p>
              </div>
              <FiBarChart2 className={`w-5 h-5 ${
                stats.financeStats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'
              }`} />
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
              <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
            </div>
            <FiDollarSign className="w-5 h-5 text-gray-400" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-48 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ) : chartData.revenueExpense.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData.revenueExpense}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorExpenses)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p className="text-sm">No financial data available</p>
            </div>
          )}
        </div>

        {/* Student Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
              <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
            </div>
            <FiUsers className="w-5 h-5 text-gray-400" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-48 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ) : chartData.studentGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData.studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p className="text-sm">No student data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Program Distribution Chart */}
      {stats.totalStudents > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Students by Program</h3>
              <p className="text-sm text-gray-500 mt-1">Distribution across programs</p>
            </div>
            <FiBookOpen className="w-5 h-5 text-gray-400" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-48 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ) : chartData.programDistribution.length > 0 && chartData.programDistribution[0].name !== 'No Data' ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.programDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const { name, percent } = props;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.programDistribution.map((_, index) => {
                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p className="text-sm">No program data available</p>
            </div>
          )}
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity - с реальными данными */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FiActivity className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <button 
              onClick={handleViewAllActivities}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition-colors"
            >
              <span>View all</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer group"
                >
                  <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiActivity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - улучшенный дизайн */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <FiPlus className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => handleQuickAction('add-student')}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Add New Student</p>
                  <p className="text-xs text-gray-600 mt-0.5">Enroll a new student</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleQuickAction('create-course')}
              className="w-full p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border border-purple-200 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FiBookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Create Course</p>
                  <p className="text-xs text-gray-600 mt-0.5">Add a new course</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleQuickAction('process-payment')}
              className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg border border-green-200 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FiCreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Process Payment</p>
                  <p className="text-xs text-gray-600 mt-0.5">Record a payment</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => handleQuickAction('generate-report')}
              className="w-full p-4 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-lg border border-amber-200 transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FiBarChart2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Generate Report</p>
                  <p className="text-xs text-gray-600 mt-0.5">View analytics</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
