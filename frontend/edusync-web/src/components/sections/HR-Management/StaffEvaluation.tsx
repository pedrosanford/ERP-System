import React, { useState } from 'react';
import { FaUserTie, FaChartLine, FaClipboardList } from 'react-icons/fa';

interface StaffMember {
    id: number;
    name: string;
    role: string;
    department: string;
    performanceScore: number;
    lastEvaluation: string;
}

interface EvaluationMetrics {
    teachingEffectiveness?: number;
    researchOutput?: number;
    studentFeedback?: number;
    administrativeDuties?: number;
    professionalDevelopment?: number;
}

const StaffEvaluation: React.FC = () => {
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [staffMembers] = useState<StaffMember[]>([
        {
            id: 1,
            name: "Dr. Smith",
            role: "Professor",
            department: "Computer Science",
            performanceScore: 4.5,
            lastEvaluation: "2025-08-15"
        },
        // Add more staff members as needed
    ]);

    const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetrics>({});

    const handleMetricChange = (metric: keyof EvaluationMetrics, value: number) => {
        setEvaluationMetrics(prev => ({
            ...prev,
            [metric]: value
        }));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUserTie /> Staff Performance & Evaluation Dashboard
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Staff List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Staff Members</h2>
                    <div className="space-y-3">
                        {staffMembers.map(staff => (
                            <div
                                key={staff.id}
                                onClick={() => setSelectedStaff(staff)}
                                className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                            >
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-gray-600">{staff.role}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FaChartLine /> Performance Metrics
                    </h2>
                    {selectedStaff && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Teaching Effectiveness</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={evaluationMetrics.teachingEffectiveness || 0}
                                    onChange={(e) => handleMetricChange('teachingEffectiveness', Number(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-sm text-gray-600">
                                    {evaluationMetrics.teachingEffectiveness || 0}/5
                                </span>
                            </div>
                            {/* Add more metric sliders similarly */}
                        </div>
                    )}
                </div>

                {/* Evaluation Notes */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FaClipboardList /> Evaluation Notes
                    </h2>
                    {selectedStaff && (
                        <div>
                            <textarea
                                className="w-full p-3 border rounded-md"
                                rows={6}
                                placeholder="Enter evaluation notes..."
                            />
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                Save Evaluation
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffEvaluation;