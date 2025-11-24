import React from 'react';
import {FaChartLine, FaUsers, FaClipboardCheck, FaExclamationTriangle, FaClock} from 'react-icons/fa';
import {FiTrendingUp} from "react-icons/fi";

const AnalyticsDashboard: React.FC = () => {
    // Sample data
    const stats = {
        totalStaff: 156,
        completedEvaluations: 89,
        avgPerformanceScore: 4.2,
        overdueEvaluations: 12
    };

    const departmentPerformance = [
        { department: 'Computer Science', avgScore: 4.5, staffCount: 25, completed: 20 },
        { department: 'Mathematics', avgScore: 4.3, staffCount: 18, completed: 16 },
        { department: 'Physics', avgScore: 4.1, staffCount: 22, completed: 18 },
        { department: 'Chemistry', avgScore: 4.0, staffCount: 20, completed: 15 },
        { department: 'Biology', avgScore: 4.4, staffCount: 19, completed: 17 }
    ];

    const performanceTrends = [
        { period: '2021-22', score: 3.8 },
        { period: '2022-23', score: 4.0 },
        { period: '2023-24', score: 4.1 },
        { period: '2024-25', score: 4.2 }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600">Performance insights and evaluation metrics</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Staff</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FaUsers className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-green-600">+5% from last period</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed Evaluations</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.completedEvaluations}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FaClipboardCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">
                            {Math.round((stats.completedEvaluations / stats.totalStaff) * 100)}% completion rate
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.avgPerformanceScore}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FiTrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-green-600">+0.1 from last period</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Overdue</p>
                            <p className="text-3xl font-bold text-red-600">{stats.overdueEvaluations}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-red-600">Requires attention</p>
                    </div>
                </div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Performance */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                    <div className="space-y-4">
                        {departmentPerformance.map((dept) => (
                            <div key={dept.department} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                                        <span className="text-sm text-gray-500">{dept.avgScore}/5.0</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                            style={{ width: `${(dept.avgScore / 5) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-gray-500">
                                            {dept.completed}/{dept.staffCount} completed
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {Math.round((dept.completed / dept.staffCount) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Trends */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                    <div className="space-y-4">
                        {performanceTrends.map((trend, index) => (
                            <div key={trend.period} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        index === performanceTrends.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                                    }`} />
                                    <span className="text-sm font-medium text-gray-700">{trend.period}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-semibold">{trend.score}</span>
                                    {index > 0 && (
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            trend.score > performanceTrends[index - 1].score
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {trend.score > performanceTrends[index - 1].score ? '↑' : '↓'}
                                            {Math.abs(trend.score - performanceTrends[index - 1].score).toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Reports */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <FaChartLine className="text-blue-600" />
                        <h3 className="font-semibold">Top Performers</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm font-medium">Dr. Sarah Johnson</span>
                            <span className="text-sm font-bold text-green-600">4.8</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm font-medium">Prof. Michael Chen</span>
                            <span className="text-sm font-bold text-green-600">4.6</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm font-medium">Dr. Lisa Wang</span>
                            <span className="text-sm font-bold text-green-600">4.5</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <FaExclamationTriangle className="text-amber-600" />
                        <h3 className="font-semibold">Needs Attention</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm font-medium">Prof. David Kim</span>
                            <span className="text-sm font-bold text-amber-600">2.8</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm font-medium">Dr. Amy Wilson</span>
                            <span className="text-sm font-bold text-amber-600">3.1</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                        <FaClock className="text-red-600" />
                        <h3 className="font-semibold">Overdue Evaluations</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-sm">
                            <div className="font-medium">Computer Science</div>
                            <div className="text-gray-500">3 evaluations overdue</div>
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">Mathematics</div>
                            <div className="text-gray-500">2 evaluations overdue</div>
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">Physics</div>
                            <div className="text-gray-500">4 evaluations overdue</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;