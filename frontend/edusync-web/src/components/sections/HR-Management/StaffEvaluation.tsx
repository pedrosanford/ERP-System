import React, { useState } from 'react';
import { 
    FaUserTie, 
    FaFileUpload,
    FaCalendarAlt,
    FaClipboardList,
    FaChartLine,
    FaUsers,
    FaCog
} from 'react-icons/fa';
import EvaluationPeriodManager from './components/EvaluationPeriodManager';
import EvaluationTemplateManager from './components/EvaluationTemplateManager';
import EvaluationForm from './components/EvaluationForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';

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
    supervisorId: number;
    hireDate: string;
    position: string;
    status: 'active' | 'inactive';
}

interface EvaluationPeriod {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    type: 'annual' | 'semester' | 'quarterly' | 'custom';
    status: 'draft' | 'active' | 'locked' | 'archived';
    description?: string;
}

interface EvaluationTemplate {
    id: number;
    name: string;
    roleType: 'teaching' | 'non-teaching' | 'management';
    criteria: EvaluationCriterion[];
    isActive: boolean;
    createdDate: string;
}

interface EvaluationCriterion {
    id: number;
    name: string;
    description: string;
    weight: number;
    scaleType: '1-5' | '1-10' | 'poor-excellent' | 'percentage';
    category: string;
}

interface EvaluationForm {
    id: number;
    staffId: number;
    evaluatorId: number;
    periodId: number;
    templateId: number;
    status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'archived';
    createdDate: string;
    submittedDate?: string;
    approvedDate?: string;
    overallRating: number;
    overallComments: string;
    details: EvaluationDetail[];
    developmentGoals: DevelopmentGoal[];
}

interface EvaluationDetail {
    criterionId: number;
    rating: number;
    comments: string;
}

interface DevelopmentGoal {
    id: number;
    title: string;
    description: string;
    targetDate: string;
    status: 'pending' | 'in-progress' | 'completed';
    progress: number;
}

type MainTab = 'dashboard' | 'evaluations' | 'periods' | 'templates' | 'reports' | 'settings';
type EvaluationTab = 'form' | 'self-eval' | 'peer-eval' | 'student-feedback' | 'history' | 'documents' | 'goals';

const StaffEvaluation: React.FC = () => {
    const [activeMainTab, setActiveMainTab] = useState<MainTab>('dashboard');
    const [activeEvaluationTab, setActiveEvaluationTab] = useState<EvaluationTab>('form');
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<EvaluationPeriod | null>(null);
    // eslint-disable-next-line no-empty-pattern
    const [] = useState<EvaluationTemplate | null>(null);
    
    // Sample data
    const [staffMembers] = useState<StaffMember[]>([
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            role: "Professor",
            department: "Computer Science",
            employeeId: "EMP001",
            yearsOfService: 8,
            qualifications: ["Ph.D. Computer Science", "M.Sc. Software Engineering"],
            specialization: "Artificial Intelligence",
            performanceScore: 4.5,
            lastEvaluation: "2024-08-15",
            supervisorId: 5,
            hireDate: "2016-09-01",
            position: "Senior Faculty",
            status: 'active'
        },
        {
            id: 2,
            name: "Prof. Michael Chen",
            role: "Associate Professor",
            department: "Mathematics",
            employeeId: "EMP002",
            yearsOfService: 12,
            qualifications: ["Ph.D. Mathematics", "M.Sc. Applied Mathematics"],
            specialization: "Statistics and Probability",
            performanceScore: 4.2,
            lastEvaluation: "2024-07-20",
            supervisorId: 6,
            hireDate: "2012-08-15",
            position: "Faculty",
            status: 'active'
        }
    ]);

    const [evaluationPeriods] = useState<EvaluationPeriod[]>([
        {
            id: 1,
            name: "Academic Year 2024-2025",
            startDate: "2024-09-01",
            endDate: "2025-08-31",
            type: "annual",
            status: "active",
            description: "Annual performance evaluation for all staff"
        },
        {
            id: 2,
            name: "Fall Semester 2024",
            startDate: "2024-09-01",
            endDate: "2024-12-31",
            type: "semester",
            status: "locked",
            description: "Mid-year evaluation period"
        }
    ]);

    const [evaluationTemplates] = useState<EvaluationTemplate[]>([
        {
            id: 1,
            name: "Teaching Staff Evaluation",
            roleType: "teaching",
            isActive: true,
            createdDate: "2024-01-15",
            criteria: [
                {
                    id: 1,
                    name: "Teaching Effectiveness",
                    description: "Quality of instruction and student engagement",
                    weight: 30,
                    scaleType: "1-5",
                    category: "Teaching"
                },
                {
                    id: 2,
                    name: "Research Output",
                    description: "Publications, grants, and research activities",
                    weight: 25,
                    scaleType: "1-5",
                    category: "Research"
                },
                {
                    id: 3,
                    name: "Student Feedback",
                    description: "Student evaluations and feedback scores",
                    weight: 20,
                    scaleType: "1-5",
                    category: "Teaching"
                },
                {
                    id: 4,
                    name: "Professional Development",
                    description: "Continuing education and skill development",
                    weight: 15,
                    scaleType: "1-5",
                    category: "Development"
                },
                {
                    id: 5,
                    name: "Service & Administrative Duties",
                    description: "Committee work and administrative responsibilities",
                    weight: 10,
                    scaleType: "1-5",
                    category: "Service"
                }
            ]
        }
    ]);

    const renderMainTabContent = () => {
        switch (activeMainTab) {
            case 'dashboard':
                return <AnalyticsDashboard />;
            case 'evaluations':
                return renderEvaluationContent();
            case 'periods':
                return <EvaluationPeriodManager periods={evaluationPeriods} />;
            case 'templates':
                return <EvaluationTemplateManager templates={evaluationTemplates} />;
            case 'reports':
                return renderReportsContent();
            case 'settings':
                return renderSettingsContent();
            default:
                return <div>Select a tab to continue</div>;
        }
    };

    const renderEvaluationContent = () => {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Staff Selection Panel */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Staff Members</h3>
                        <FaUsers className="text-gray-400" />
                    </div>
                    
                    {/* Period Selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Evaluation Period</label>
                        <select 
                            className="w-full p-2 border rounded-md"
                            value={selectedPeriod?.id || ''}
                            onChange={(e) => {
                                const period = evaluationPeriods.find(p => p.id === Number(e.target.value));
                                setSelectedPeriod(period || null);
                            }}
                        >
                            <option value="">Select Period</option>
                            {evaluationPeriods.map(period => (
                                <option key={period.id} value={period.id}>
                                    {period.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Staff List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {staffMembers.map(staff => (
                            <div
                                key={staff.id}
                                onClick={() => setSelectedStaff(staff)}
                                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors
                                    ${selectedStaff?.id === staff.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}
                            >
                                <div className="font-medium text-sm">{staff.name}</div>
                                <div className="text-xs text-gray-600">{staff.role}</div>
                                <div className="text-xs text-gray-500">{staff.department}</div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        {staff.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Score: {staff.performanceScore}/5
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Evaluation Content */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow-md">
                    {selectedStaff && selectedPeriod ? (
                        <>
                            {/* Staff Header */}
                            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{selectedStaff.name}</h2>
                                        <p className="text-sm text-gray-600">
                                            {selectedStaff.role} • {selectedStaff.department} • ID: {selectedStaff.employeeId}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">{selectedStaff.performanceScore}</div>
                                        <div className="text-xs text-gray-500">Current Rating</div>
                                    </div>
                                </div>
                            </div>

                            {/* Evaluation Tabs */}
                            <div className="border-b">
                                <div className="flex space-x-1 px-6">
                                    {(['form', 'self-eval', 'peer-eval', 'student-feedback', 'history', 'documents', 'goals'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveEvaluationTab(tab)}
                                            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors
                                                ${activeEvaluationTab === tab 
                                                    ? 'border-blue-500 text-blue-600' 
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {renderEvaluationTabContent()}
                            </div>

                            {/* Action Bar */}
                            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm text-gray-600">
                                            Period: {selectedPeriod.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Last updated: {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                            Save Draft
                                        </button>
                                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                                            Submit for Review
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                            Approve Evaluation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <FaClipboardList className="mx-auto text-4xl mb-4" />
                            <h3 className="text-lg font-medium mb-2">Ready to Start Evaluating?</h3>
                            <p className="text-sm mb-4">Select an evaluation period and staff member to begin the evaluation process.</p>
                            {!selectedPeriod && (
                                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md inline-block">
                                    Please select an evaluation period first
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderEvaluationTabContent = () => {
        if (!selectedStaff || !selectedPeriod) return null;

        const template = evaluationTemplates.find(t => 
            (selectedStaff.role.includes('Professor') || selectedStaff.role.includes('Instructor')) 
                ? t.roleType === 'teaching' 
                : t.roleType === 'non-teaching'
        );

        switch (activeEvaluationTab) {
            case 'form':
                return template ? (
                    <EvaluationForm 
                        template={template} 
                        staffMember={selectedStaff} 
                        period={selectedPeriod}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <p>No evaluation template found for this role type.</p>
                    </div>
                );
            
            case 'documents':
                return renderDocumentsTab();
            
            case 'goals':
                return renderDevelopmentGoalsTab();
            
            default:
                return (
                    <div className="text-center text-gray-500 py-8">
                        <p>This feature is coming soon...</p>
                    </div>
                );
        }
    };

    const renderDocumentsTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Supporting Documents</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <FaFileUpload /> Upload Document
                </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FaFileUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">Upload Supporting Documents</h4>
                <p className="text-gray-500 mb-4">
                    Drag and drop files here, or click to browse
                </p>
                <p className="text-sm text-gray-400">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                </p>
                <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" />
            </div>
            
            <div className="space-y-3">
                <h4 className="font-medium">Uploaded Documents</h4>
                <div className="text-sm text-gray-500">
                    No documents uploaded yet.
                </div>
            </div>
        </div>
    );

    const renderDevelopmentGoalsTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Development Goals & Action Plans</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Add New Goal
                </button>
            </div>
            
            <div className="grid gap-6">
                {/* Strengths Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-3">Key Strengths</h4>
                    <textarea
                        className="w-full p-3 border border-green-200 rounded-md resize-none"
                        rows={3}
                        placeholder="Identify and document key strengths demonstrated during this evaluation period..."
                    />
                </div>
                
                {/* Areas for Improvement */}
                <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-3">Areas for Improvement</h4>
                    <textarea
                        className="w-full p-3 border border-amber-200 rounded-md resize-none"
                        rows={3}
                        placeholder="Outline specific areas that need attention and improvement..."
                    />
                </div>
                
                {/* Development Goals */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-3">Professional Development Plan</h4>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-md border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <input 
                                    type="text" 
                                    placeholder="Development goal title"
                                    className="font-medium text-sm bg-transparent border-none outline-none flex-1"
                                />
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">In Progress</span>
                            </div>
                            <textarea
                                className="w-full p-2 text-sm border border-gray-200 rounded resize-none"
                                rows={2}
                                placeholder="Describe the specific development goal and action steps..."
                            />
                            <div className="flex items-center justify-between mt-3">
                                <label className="text-xs text-gray-600">Target Date:</label>
                                <input type="date" className="text-xs border border-gray-200 rounded px-2 py-1" />
                            </div>
                            <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>60%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderReportsContent = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-3">Department Performance</h3>
                    <p className="text-sm text-gray-600 mb-4">Compare average ratings across departments</p>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Generate Report
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-3">Performance Trends</h3>
                    <p className="text-sm text-gray-600 mb-4">Year-over-year performance analysis</p>
                    <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Generate Report
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-3">Evaluation Status</h3>
                    <p className="text-sm text-gray-600 mb-4">Track completion rates and overdue evaluations</p>
                    <button className="w-full py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSettingsContent = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-3">Notification Settings</h3>
                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Email reminders for overdue evaluations</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Notify supervisors of submissions</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Send weekly progress reports</span>
                        </label>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-3">Access Control</h3>
                    <div className="space-y-3">
                        <div className="text-sm">
                            <strong>HR Admin:</strong> Full system access
                        </div>
                        <div className="text-sm">
                            <strong>Department Heads:</strong> Department staff only
                        </div>
                        <div className="text-sm">
                            <strong>Evaluators:</strong> Assigned staff only
                        </div>
                        <div className="text-sm">
                            <strong>Staff:</strong> Own evaluations only
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaUserTie className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Staff Evaluation System</h1>
                                <p className="text-sm text-gray-600">Comprehensive performance management platform</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <FaCog className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {([
                            { key: 'dashboard', label: 'Dashboard', icon: FaChartLine },
                            { key: 'evaluations', label: 'Evaluations', icon: FaClipboardList },
                            { key: 'periods', label: 'Periods', icon: FaCalendarAlt },
                            { key: 'templates', label: 'Templates', icon: FaFileUpload },
                            { key: 'reports', label: 'Reports', icon: FaFileUpload },
                            { key: 'settings', label: 'Settings', icon: FaCog }
                        ] as const).map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveMainTab(key)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${activeMainTab === key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {renderMainTabContent()}
            </div>
        </div>
    );
};

export default StaffEvaluation;