import React, { useState } from 'react';
import { 
    FaUserTie, 

    FaFileUpload
} from 'react-icons/fa';

interface StaffMember {
    id: number;
    name: string;
    role: string;
    department: string;
    employeeId: string;
    yearsOfService: number;
    qualifications: string[];
    specialization: string;
    performanceScore: number;
    lastEvaluation: string;
}

interface EvaluationMetrics {
    teachingEffectiveness: number;
    researchOutput: number;
    studentFeedback: number;
    administrativeDuties: number;
    professionalDevelopment: number;
    curriculumDevelopment: number;
    committeeParticipation: number;
    peerCollaboration: number;
}

type TabType = 'info' | 'metrics' | 'history' | 'documents' | 'goals';

const StaffEvaluation: React.FC = () => {
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [staffMembers] = useState<StaffMember[]>([
        {
            id: 1,
            name: "Dr. Smith",
            role: "Professor",
            department: "Computer Science",
            employeeId: "EMP001",
            yearsOfService: 5,
            qualifications: ["Ph.D. Computer Science", "M.Sc. Software Engineering"],
            specialization: "Artificial Intelligence",
            performanceScore: 4.5,
            lastEvaluation: "2025-08-15"
        }
    ]);

    const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetrics>({
        teachingEffectiveness: 0,
        researchOutput: 0,
        studentFeedback: 0,
        administrativeDuties: 0,
        professionalDevelopment: 0,
        curriculumDevelopment: 0,
        committeeParticipation: 0,
        peerCollaboration: 0
    });

    const [lastUpdated] = useState<Date>(new Date());

    const handleMetricChange = (metric: keyof EvaluationMetrics, value: number) => {
        setEvaluationMetrics(prev => ({
            ...prev,
            [metric]: value
        }));
    };

    const renderTabContent = () => {
        if (!selectedStaff) return null;

        switch (activeTab) {
            case 'info':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-medium">Employee ID</label>
                                <p className="text-gray-600">{selectedStaff.employeeId}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="font-medium">Years of Service</label>
                                <p className="text-gray-600">{selectedStaff.yearsOfService}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="font-medium">Specialization</label>
                                <p className="text-gray-600">{selectedStaff.specialization}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="font-medium">Qualifications</label>
                                <ul className="list-disc pl-4">
                                    {selectedStaff.qualifications.map((qual, index) => (
                                        <li key={index} className="text-gray-600">{qual}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'metrics':
                return (
                    <div className="space-y-4">
                        {(Object.keys(evaluationMetrics) as Array<keyof EvaluationMetrics>).map((metric) => (
                            <div key={metric} className="space-y-2">
                                <label className="block text-sm font-medium">
                                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={evaluationMetrics[metric]}
                                    onChange={(e) => handleMetricChange(metric, Number(e.target.value))}
                                    className="w-full"
                                />
                                <span className="text-sm text-gray-600">
                                    {evaluationMetrics[metric]}/5
                                </span>
                            </div>
                        ))}
                    </div>
                );

            case 'history':
                return (
                    <div className="space-y-4">
                        <h3 className="font-medium">Evaluation History</h3>
                        <p className="text-gray-600">No previous evaluations found.</p>
                    </div>
                );

            case 'documents':
                return (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <FaFileUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                            <p className="text-gray-600">Drag and drop files or click to upload</p>
                            <input type="file" className="hidden" />
                        </div>
                    </div>
                );

            case 'goals':
                return (
                    <div className="space-y-4">
                        <textarea
                            className="w-full p-3 border rounded-md"
                            rows={4}
                            placeholder="Enter development goals..."
                        />
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Progress</label>
                            <input type="range" className="w-1/2" min="0" max="100" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUserTie /> Staff Performance & Evaluation Dashboard
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Staff List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Staff Members</h2>
                    <div className="space-y-3">
                        {staffMembers.map(staff => (
                            <div
                                key={staff.id}
                                onClick={() => setSelectedStaff(staff)}
                                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 
                                    ${selectedStaff?.id === staff.id ? 'bg-blue-50 border-blue-300' : ''}`}
                            >
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-gray-600">{staff.role}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3 bg-white rounded-lg shadow-md">
                    {selectedStaff ? (
                        <>
                            {/* Tabs */}
                            <div className="border-b px-6 py-2">
                                <div className="flex space-x-4">
                                    {(['info', 'metrics', 'history', 'documents', 'goals'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-2 px-3 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {renderTabContent()}
                            </div>

                            {/* Action Buttons */}
                            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Last updated: {lastUpdated.toLocaleDateString()}
                                    </div>
                                    <div className="space-x-3">
                                        <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                                            Save Draft
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                            Submit Evaluation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            Select a staff member to view their evaluation
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffEvaluation;