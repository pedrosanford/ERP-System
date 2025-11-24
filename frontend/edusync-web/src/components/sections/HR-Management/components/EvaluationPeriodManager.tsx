import React, { useState } from 'react';
import { FaCalendarAlt, FaPlus, FaLock, FaArchive, FaEdit } from 'react-icons/fa';

interface EvaluationPeriodManagerProps {
    periods: any[];
}

const EvaluationPeriodManager: React.FC<EvaluationPeriodManagerProps> = ({ periods }) => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPeriod, setNewPeriod] = useState({
        name: '',
        type: 'annual' as 'annual' | 'semester' | 'quarterly' | 'custom',
        startDate: '',
        endDate: '',
        description: ''
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-700';
            case 'active': return 'bg-green-100 text-green-700';
            case 'locked': return 'bg-yellow-100 text-yellow-700';
            case 'archived': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Evaluation Periods</h2>
                    <p className="text-gray-600">Manage academic years, semesters, and custom evaluation cycles</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <FaPlus /> New Period
                </button>
            </div>

            {/* Create Period Form */}
            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-lg font-semibold mb-4">Create New Evaluation Period</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Period Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-md"
                                placeholder="e.g., Academic Year 2024-2025"
                                value={newPeriod.name}
                                onChange={(e) => setNewPeriod({...newPeriod, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Period Type</label>
                            <select
                                className="w-full p-3 border rounded-md"
                                value={newPeriod.type}
                                onChange={(e) => setNewPeriod({...newPeriod, type: e.target.value as any})}
                            >
                                <option value="annual">Annual</option>
                                <option value="semester">Semester</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Start Date</label>
                            <input
                                type="date"
                                className="w-full p-3 border rounded-md"
                                value={newPeriod.startDate}
                                onChange={(e) => setNewPeriod({...newPeriod, startDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">End Date</label>
                            <input
                                type="date"
                                className="w-full p-3 border rounded-md"
                                value={newPeriod.endDate}
                                onChange={(e) => setNewPeriod({...newPeriod, endDate: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                className="w-full p-3 border rounded-md"
                                rows={3}
                                placeholder="Optional description of the evaluation period"
                                value={newPeriod.description}
                                onChange={(e) => setNewPeriod({...newPeriod, description: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Create Period
                        </button>
                    </div>
                </div>
            )}

            {/* Periods List */}
            <div className="grid grid-cols-1 gap-4">
                {periods.map((period) => (
                    <div key={period.id} className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{period.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                                    </p>
                                    {period.description && (
                                        <p className="text-sm text-gray-500 mt-1">{period.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(period.status)}`}>
                                    {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                        <FaEdit />
                                    </button>
                                    {period.status === 'active' && (
                                        <button className="p-2 text-yellow-400 hover:text-yellow-600">
                                            <FaLock />
                                        </button>
                                    )}
                                    {period.status === 'locked' && (
                                        <button className="p-2 text-red-400 hover:text-red-600">
                                            <FaArchive />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Period Statistics */}
                        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">156</div>
                                <div className="text-sm text-gray-500">Total Staff</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">89</div>
                                <div className="text-sm text-gray-500">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-600">67</div>
                                <div className="text-sm text-gray-500">Pending</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvaluationPeriodManager;