import React, { useState } from 'react';
import {
  FiTarget, FiUsers, FiTrendingUp, FiDollarSign, FiPhone, FiMail,
  FiCalendar, FiClock, FiMessageSquare, FiExternalLink, FiFilter,
  FiSearch, FiMapPin, FiBook, FiStar, FiMoreHorizontal, FiChevronDown,
  FiX, FiEdit, FiSave, FiPlus, FiCheck, FiUser, FiBookOpen, FiFileText
} from 'react-icons/fi';

const Sales: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<any | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedDashboardItem, setSelectedDashboardItem] = useState<any | null>(null);
  const [draggedLead, setDraggedLead] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const kanbanStages = [
    { id: 'inquiry', title: 'New Inquiry', color: 'bg-blue-500', lineColor: 'bg-blue-500', count: 1 },
    { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500', lineColor: 'bg-yellow-500', count: 1 },
    { id: 'application-started', title: 'Application Started', color: 'bg-orange-500', lineColor: 'bg-orange-500', count: 1 },
    { id: 'application-submitted', title: 'Application Submitted', color: 'bg-purple-500', lineColor: 'bg-purple-500', count: 1 },
    { id: 'interview-scheduled', title: 'Interview/Tour Scheduled', color: 'bg-indigo-500', lineColor: 'bg-indigo-500', count: 1 },
    { id: 'accepted', title: 'Accepted/Offered', color: 'bg-green-500', lineColor: 'bg-green-500', count: 0 },
    { id: 'enrolled', title: 'Enrolled', color: 'bg-emerald-500', lineColor: 'bg-emerald-500', count: 0 },
    { id: 'lost', title: 'Lost/Not Interested', color: 'bg-gray-500', lineColor: 'bg-gray-500', count: 0 }
  ];

  const [leadsData, setLeadsData] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      parentName: 'Mike Johnson',
      grade: '9th Grade',
      program: 'STEM Program',
      source: 'School Fair',
      enrollmentTerm: 'Fall 2025',
      status: 'inquiry',
      priority: 'high',
      notes: 'Interested in robotics program',
      followUpDate: '2025-01-15',
      phone: '(555) 123-4567',
      email: 'mike.johnson@email.com',
      estimatedTuitionValue: 25000,
      assignedRecruiter: 'John Smith',
      preferredContactMethod: 'email',
      statusNotes: 'Very interested in robotics program. Parent is an engineer.',
      nextFollowUpDate: '2025-01-20',
      taskChecklist: [
        { id: '1', title: 'Send program brochure', completed: true, dueDate: '2025-01-12' },
        { id: '2', title: 'Schedule campus tour', completed: false, dueDate: '2025-01-18' },
        { id: '3', title: 'Follow up on application', completed: false, dueDate: '2025-01-25' }
      ],
      communicationLog: [
        {
          id: '1',
          type: 'email',
          summary: 'Sent initial welcome email with program information',
          timestamp: '2025-01-10T10:00:00Z',
          followUpRequired: false
        },
        {
          id: '2',
          type: 'call',
          summary: 'Spoke with parent about tuition and financial aid options',
          timestamp: '2025-01-12T14:30:00Z',
          followUpRequired: true
        }
      ],
      scholarshipRequested: true,
      scholarshipNotes: 'Family interested in merit-based scholarships',
      scholarshipAmount: 5000,
      applicationFeeStatus: true,
      submissionDate: '2025-01-08',
      interviewDate: '2025-01-22',
      interviewer: 'Dr. Smith',
      enrollmentDeadline: '2025-03-01',
      offerLetterSent: false,
      tuitionPaid: 0,
      studentId: '',
      dormAssigned: ''
    },
    {
      id: 2,
      name: 'Alex Chen',
      parentName: 'Lisa Chen',
      grade: '11th Grade',
      program: 'IB Program',
      source: 'Online Form',
      enrollmentTerm: 'Fall 2025',
      status: 'contacted',
      priority: 'medium',
      notes: 'Needs financial aid info',
      followUpDate: '2025-01-16',
      phone: '(555) 987-6543',
      email: 'lisa.chen@email.com',
      estimatedTuitionValue: 28000,
      assignedRecruiter: 'Jane Doe',
      preferredContactMethod: 'phone',
      statusNotes: 'Parent works two jobs, needs flexible payment options.',
      nextFollowUpDate: '2025-01-19',
      taskChecklist: [
        { id: '4', title: 'Send financial aid packet', completed: false, dueDate: '2025-01-17' },
        { id: '5', title: 'Schedule financial consultation', completed: false, dueDate: '2025-01-20' }
      ],
      communicationLog: [
        {
          id: '3',
          type: 'call',
          summary: 'Initial contact call, discussed program options',
          timestamp: '2025-01-13T15:00:00Z',
          followUpRequired: true
        }
      ],
      scholarshipRequested: true,
      scholarshipNotes: 'Needs significant financial assistance',
      scholarshipAmount: 10000,
      applicationFeeStatus: false,
      submissionDate: '',
      interviewDate: '',
      interviewer: '',
      enrollmentDeadline: '2025-03-01',
      offerLetterSent: false,
      tuitionPaid: 0,
      studentId: '',
      dormAssigned: ''
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      parentName: 'Carlos Rodriguez',
      grade: '10th Grade',
      program: 'Arts Program',
      source: 'Referral',
      enrollmentTerm: 'Spring 2026',
      status: 'application-started',
      priority: 'high',
      notes: 'Portfolio review needed',
      followUpDate: '2025-01-14',
      phone: '(555) 456-7890',
      email: 'carlos.rodriguez@email.com',
      estimatedTuitionValue: 26000,
      assignedRecruiter: 'Maria Garcia',
      preferredContactMethod: 'email',
      statusNotes: 'Talented artist, portfolio looks very promising.',
      nextFollowUpDate: '2025-01-21',
      taskChecklist: [
        { id: '6', title: 'Review art portfolio', completed: true, dueDate: '2025-01-10' },
        { id: '7', title: 'Schedule art department meeting', completed: false, dueDate: '2025-01-16' }
      ],
      communicationLog: [
        {
          id: '4',
          type: 'meeting',
          summary: 'Portfolio review meeting with art department head',
          timestamp: '2025-01-11T11:00:00Z',
          followUpRequired: false
        }
      ],
      scholarshipRequested: false,
      scholarshipNotes: '',
      scholarshipAmount: 0,
      applicationFeeStatus: true,
      submissionDate: '2025-01-05',
      interviewDate: '2025-01-20',
      interviewer: 'Prof. Williams',
      enrollmentDeadline: '2025-08-01',
      offerLetterSent: false,
      tuitionPaid: 0,
      studentId: '',
      dormAssigned: ''
    },
    {
      id: 4,
      name: 'David Kim',
      parentName: 'Jennifer Kim',
      grade: '12th Grade',
      program: 'AP Program',
      source: 'Social Media',
      enrollmentTerm: 'Fall 2025',
      status: 'application-submitted',
      priority: 'medium',
      notes: 'Waiting on transcript',
      followUpDate: '2025-01-17',
      phone: '(555) 234-5678',
      email: 'jennifer.kim@email.com',
      estimatedTuitionValue: 30000,
      assignedRecruiter: 'Tom Wilson',
      preferredContactMethod: 'email',
      statusNotes: 'Strong academic record, waiting on final grades.',
      nextFollowUpDate: '2025-01-23',
      taskChecklist: [
        { id: '8', title: 'Follow up on transcripts', completed: false, dueDate: '2025-01-18' },
        { id: '9', title: 'Schedule admissions interview', completed: false, dueDate: '2025-01-24' }
      ],
      communicationLog: [
        {
          id: '5',
          type: 'email',
          summary: 'Sent application checklist and transcript request form',
          timestamp: '2025-01-14T09:00:00Z',
          followUpRequired: true
        }
      ],
      scholarshipRequested: true,
      scholarshipNotes: 'Academic merit scholarship candidate',
      scholarshipAmount: 8000,
      applicationFeeStatus: true,
      submissionDate: '2025-01-12',
      interviewDate: '',
      interviewer: '',
      enrollmentDeadline: '2025-03-01',
      offerLetterSent: false,
      tuitionPaid: 0,
      studentId: '',
      dormAssigned: ''
    },
    {
      id: 5,
      name: 'Sophia Williams',
      parentName: 'Robert Williams',
      grade: '9th Grade',
      program: 'General Studies',
      source: 'Website',
      enrollmentTerm: 'Fall 2025',
      status: 'interview-scheduled',
      priority: 'high',
      notes: 'Campus tour on Friday',
      followUpDate: '2025-01-18',
      phone: '(555) 345-6789',
      email: 'robert.williams@email.com',
      estimatedTuitionValue: 24000,
      assignedRecruiter: 'Sarah Johnson',
      preferredContactMethod: 'phone',
      statusNotes: 'Very enthusiastic family, ready to commit.',
      nextFollowUpDate: '2025-01-25',
      taskChecklist: [
        { id: '10', title: 'Prepare campus tour materials', completed: true, dueDate: '2025-01-15' },
        { id: '11', title: 'Conduct campus tour', completed: false, dueDate: '2025-01-19' },
        { id: '12', title: 'Send follow-up information packet', completed: false, dueDate: '2025-01-20' }
      ],
      communicationLog: [
        {
          id: '6',
          type: 'call',
          summary: 'Scheduled campus tour and interview',
          timestamp: '2025-01-15T14:00:00Z',
          followUpRequired: false
        }
      ],
      scholarshipRequested: false,
      scholarshipNotes: '',
      scholarshipAmount: 0,
      applicationFeeStatus: true,
      submissionDate: '2025-01-10',
      interviewDate: '2025-01-19',
      interviewer: 'Ms. Davis',
      enrollmentDeadline: '2025-03-01',
      offerLetterSent: false,
      tuitionPaid: 0,
      studentId: '',
      dormAssigned: ''
    }
  ]);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    setDraggedLead(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedLead) {
      const updatedLeads = leadsData.map(lead =>
        lead.id === draggedLead ? { ...lead, status: stageId } : lead
      );
      setLeadsData(updatedLeads);
    }
    setDraggedLead(null);
    setDragOverStage(null);
  };

  // Dashboard data with detailed information
  const dashboardItems = [
    {
      id: 'new-leads',
      title: 'New Leads This Month',
      value: '47',
      icon: FiUsers,
      color: 'text-blue-500',
      subtitle: '+23% from last month',
      expandedData: {
        monthlyData: [
          { month: 'January', leads: 47, change: '+23%' },
          { month: 'December', leads: 38, change: '+15%' },
          { month: 'November', leads: 33, change: '+8%' },
          { month: 'October', leads: 31, change: '+12%' }
        ],
        sources: [
          { source: 'School Fairs', count: 15, percentage: 32 },
          { source: 'Website', count: 12, percentage: 26 },
          { source: 'Referrals', count: 10, percentage: 21 },
          { source: 'Social Media', count: 7, percentage: 15 },
          { source: 'Other', count: 3, percentage: 6 }
        ]
      }
    },
    {
      id: 'applications',
      title: 'Applications in Progress',
      value: '18',
      icon: FiClock,
      color: 'text-orange-500',
      subtitle: '6 started this week',
      expandedData: {
        statusBreakdown: [
          { status: 'Started', count: 8, percentage: 44 },
          { status: 'In Review', count: 6, percentage: 33 },
          { status: 'Pending Documents', count: 4, percentage: 22 }
        ],
        weeklyProgress: [
          { week: 'This Week', started: 6, completed: 3 },
          { week: 'Last Week', started: 4, completed: 5 },
          { week: '2 Weeks Ago', started: 3, completed: 2 },
          { week: '3 Weeks Ago', started: 5, completed: 4 }
        ]
      }
    },
    {
      id: 'conversion',
      title: 'Enrollment Conversion',
      value: '24.5%',
      icon: FiTarget,
      color: 'text-green-500',
      subtitle: '+3.2% improvement',
      expandedData: {
        conversionFunnel: [
          { stage: 'Inquiries', count: 200, percentage: 100 },
          { stage: 'Applications Started', count: 95, percentage: 47.5 },
          { stage: 'Applications Submitted', count: 72, percentage: 36 },
          { stage: 'Interviews', count: 58, percentage: 29 },
          { stage: 'Enrollments', count: 49, percentage: 24.5 }
        ],
        monthlyTrends: [
          { month: 'Jan', rate: 24.5 },
          { month: 'Dec', rate: 21.3 },
          { month: 'Nov', rate: 19.8 },
          { month: 'Oct', rate: 22.1 }
        ]
      }
    },
    {
      id: 'pipeline-value',
      title: 'Pipeline Value',
      value: '$287K',
      icon: FiDollarSign,
      color: 'text-purple-500',
      subtitle: 'Potential tuition revenue',
      expandedData: {
        stageValues: [
          { stage: 'New Inquiry', value: 75000, count: 25 },
          { stage: 'Contacted', value: 68000, count: 18 },
          { stage: 'Application Started', value: 52000, count: 15 },
          { stage: 'Application Submitted', value: 48000, count: 12 },
          { stage: 'Interview Scheduled', value: 44000, count: 10 }
        ],
        projectedRevenue: {
          conservative: 215000,
          realistic: 287000,
          optimistic: 345000
        }
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Admissions</h1>
          <p className="text-gray-600">Manage student recruitment and enrollment pipeline</p>
        </div>
        <button
          onClick={() => setShowAddLeadModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <FiUsers className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboardItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedDashboardItem(item)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                </div>
                <IconComponent className={`w-8 h-8 ${item.color}`} />
              </div>
              <p className="text-sm text-green-600 mt-2">{item.subtitle}</p>
            </div>
          );
        })}

        {/* Additional Dashboard Items */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <FiCalendar className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">3 open houses this week</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Lead Source</p>
              <p className="text-xl font-bold text-gray-900">School Fairs</p>
            </div>
            <FiMapPin className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">32% of all leads</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Follow-ups Due Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <FiClock className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-red-600 mt-2">5 overdue from yesterday</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Communications</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-cyan-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">89 emails, 67 calls</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Grades</option>
                <option value="elementary">Elementary</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Color Codes:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">High Priority</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Scholarship</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Special Program</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Student Recruitment Pipeline</h3>
            <div className="text-sm text-gray-600">
              Total Pipeline: <span className="font-semibold">{leadsData.length} leads</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanStages.map((stage) => {
              const isDraggedOver = dragOverStage === stage.id;

              return (
                <div
                  key={stage.id}
                  className={`min-w-80 flex-shrink-0 bg-gray-50 rounded-lg transition-all duration-200 ${
                    isDraggedOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                <div className="p-4 border-b border-gray-200 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{stage.title}</h4>
                    <span className={`text-xs text-white px-2 py-1 rounded-full ${stage.color}`}>
                      {leadsData.filter(lead => lead.status === stage.id).length}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${stage.lineColor} rounded-b-sm`}></div>

                  {isDraggedOver && (
                    <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-t-lg flex items-center justify-center">
                      <span className="text-blue-700 font-medium text-sm">Drop lead here</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-4 min-h-96 max-h-[600px] overflow-y-auto">
                  {leadsData
                    .filter(lead => lead.status === stage.id)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${
                          draggedLead === lead.id ? 'opacity-50 transform rotate-2' : ''
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 text-sm truncate">{lead.name}</h5>
                              <p className="text-xs text-gray-600 mt-1">Parent: {lead.parentName}</p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {lead.priority === 'high' && (
                                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" title="High Priority"></div>
                              )}
                              <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                                <FiExternalLink className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                              <FiBook className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{lead.grade} • {lead.program}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiMapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">Source: {lead.source}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiCalendar className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">Term: {lead.enrollmentTerm}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}

                  {/* Add New Lead Card */}
                  <div
                    className={`bg-white/50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-white/80 transition-all duration-200 cursor-pointer ${
                      isDraggedOver ? 'border-blue-400 bg-blue-50' : ''
                    }`}
                    onClick={() => setShowAddLeadModal(true)}
                  >
                    <FiUsers className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">
                      {isDraggedOver && draggedLead ? 'Drop lead here' : 'Add Lead'}
                    </span>
                  </div>

                  {/* Drop zone for empty columns */}
                  {leadsData.filter(lead => lead.status === stage.id).length === 0 && isDraggedOver && (
                    <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-8 text-center">
                      <span className="text-blue-700 font-medium">Drop lead here</span>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                <p className="text-sm text-gray-600">Parent: {selectedLead.parentName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isEditing
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <FiSave className="w-4 h-4 inline mr-1" />
                      Save
                    </>
                  ) : (
                    <>
                      <FiEdit className="w-4 h-4 inline mr-1" />
                      Edit
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Lead/Student Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2" />
                  Lead/Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      value={selectedLead.name}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                    <input
                      type="text"
                      value={selectedLead.parentName}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                    <input
                      type="text"
                      value={selectedLead.grade}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Interest</label>
                    <input
                      type="text"
                      value={selectedLead.program}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                    <input
                      type="text"
                      value={selectedLead.source}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Term</label>
                    <input
                      type="text"
                      value={selectedLead.enrollmentTerm}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiPhone className="w-5 h-5 mr-2" />
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={selectedLead.email}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={selectedLead.phone}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                    <select
                      value={selectedLead.preferredContactMethod || 'email'}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="text">Text Message</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Recruiter</label>
                    <input
                      type="text"
                      value={selectedLead.assignedRecruiter || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Progress & Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTrendingUp className="w-5 h-5 mr-2" />
                  Progress & Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <select
                      value={selectedLead.status}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      {kanbanStages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                    <select
                      value={selectedLead.priority}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Fee Status</label>
                    <select
                      value={selectedLead.applicationFeeStatus ? 'paid' : 'pending'}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
                    <input
                      type="date"
                      value={selectedLead.submissionDate || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
                    <input
                      type="date"
                      value={selectedLead.interviewDate || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                    <input
                      type="text"
                      value={selectedLead.interviewer || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Notes</label>
                  <textarea
                    value={selectedLead.statusNotes || ''}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Task Checklist */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiCheck className="w-5 h-5 mr-2" />
                  Task Checklist
                </h3>
                <div className="space-y-3">
                  {selectedLead.taskChecklist?.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          disabled={!isEditing}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{task.dueDate}</span>
                    </div>
                  ))}
                  {isEditing && (
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors">
                      <FiPlus className="w-4 h-4 inline mr-2" />
                      Add Task
                    </button>
                  )}
                </div>
              </div>

              {/* Communication Log */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMessageSquare className="w-5 h-5 mr-2" />
                  Communication Log
                </h3>
                <div className="space-y-3">
                  {selectedLead.communicationLog?.map((comm: any) => (
                    <div key={comm.id} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            comm.type === 'email' ? 'bg-blue-100 text-blue-700' :
                            comm.type === 'call' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {comm.type}
                          </span>
                          {comm.followUpRequired && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              Follow-up Required
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comm.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comm.summary}</p>
                    </div>
                  ))}
                  {isEditing && (
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors">
                      <FiPlus className="w-4 h-4 inline mr-2" />
                      Add Communication
                    </button>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2" />
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Tuition Value</label>
                    <input
                      type="number"
                      value={selectedLead.estimatedTuitionValue || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Requested</label>
                    <select
                      value={selectedLead.scholarshipRequested ? 'yes' : 'no'}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Amount</label>
                    <input
                      type="number"
                      value={selectedLead.scholarshipAmount || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Paid</label>
                    <input
                      type="number"
                      value={selectedLead.tuitionPaid || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Notes</label>
                  <textarea
                    value={selectedLead.scholarshipNotes || ''}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiFileText className="w-5 h-5 mr-2" />
                  Notes
                </h3>
                <textarea
                  value={selectedLead.notes}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-between">
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <FiPhone className="w-4 h-4 inline mr-2" />
                  Call
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <FiMail className="w-4 h-4 inline mr-2" />
                  Email
                </button>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  <FiCalendar className="w-4 h-4 inline mr-2" />
                  Schedule
                </button>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter student name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter parent name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select grade</option>
                      <option value="K">Kindergarten</option>
                      <option value="1st Grade">1st Grade</option>
                      <option value="2nd Grade">2nd Grade</option>
                      <option value="3rd Grade">3rd Grade</option>
                      <option value="4th Grade">4th Grade</option>
                      <option value="5th Grade">5th Grade</option>
                      <option value="6th Grade">6th Grade</option>
                      <option value="7th Grade">7th Grade</option>
                      <option value="8th Grade">8th Grade</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Interest</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select program</option>
                      <option value="STEM Program">STEM Program</option>
                      <option value="IB Program">IB Program</option>
                      <option value="AP Program">AP Program</option>
                      <option value="Arts Program">Arts Program</option>
                      <option value="General Studies">General Studies</option>
                      <option value="Sports Program">Sports Program</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Term</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select term</option>
                      <option value="Fall 2025">Fall 2025</option>
                      <option value="Spring 2026">Spring 2026</option>
                      <option value="Fall 2026">Fall 2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select source</option>
                      <option value="School Fair">School Fair</option>
                      <option value="Website">Website</option>
                      <option value="Online Form">Online Form</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="text">Text Message</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Notes</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any initial notes about the lead..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Tuition Value</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter estimated value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="scholarshipRequested"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="scholarshipRequested" className="ml-2 text-sm text-gray-700">
                    Scholarship assistance requested
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Item Detail Modal */}
      {selectedDashboardItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedDashboardItem.title}</h2>
                <p className="text-sm text-gray-600">Detailed analytics and insights</p>
              </div>
              <button
                onClick={() => setSelectedDashboardItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Main Metric */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{selectedDashboardItem.value}</div>
                <div className="text-lg text-gray-600 mb-1">{selectedDashboardItem.title}</div>
                <div className="text-sm text-green-600">{selectedDashboardItem.subtitle}</div>
              </div>

              {/* Dynamic Content Based on Item Type */}
              {selectedDashboardItem.id === 'new-leads' && (
                <>
                  {/* Monthly Trends */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.monthlyData.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{item.month}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{item.leads} leads</span>
                            <span className="text-green-600 text-sm">{item.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lead Sources */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.sources.map((source: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{source.source}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{source.count} leads</span>
                            <span className="text-gray-500 text-sm">({source.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedDashboardItem.id === 'applications' && (
                <>
                  {/* Application Status Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.statusBreakdown.map((status: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{status.status}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{status.count} applications</span>
                            <span className="text-gray-500 text-sm">({status.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.weeklyProgress.map((week: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{week.week}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-blue-600">{week.started} started</span>
                            <span className="text-green-600">{week.completed} completed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedDashboardItem.id === 'conversion' && (
                <>
                  {/* Conversion Funnel */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.conversionFunnel.map((stage: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{stage.stage}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{stage.count}</span>
                            <span className="text-gray-500 text-sm">({stage.percentage}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Trends */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Conversion Rates</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.monthlyTrends.map((trend: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{trend.month}</span>
                          <span className="font-semibold">{trend.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedDashboardItem.id === 'pipeline-value' && (
                <>
                  {/* Stage Values */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Value by Stage</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.stageValues.map((stage: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-700">{stage.stage}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">${stage.value.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm">({stage.count} leads)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Projections */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Projections</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Conservative (60%)</span>
                        <span className="font-semibold">${selectedDashboardItem.expandedData.projectedRevenue.conservative.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Realistic (80%)</span>
                        <span className="font-semibold text-blue-600">${selectedDashboardItem.expandedData.projectedRevenue.realistic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Optimistic (95%)</span>
                        <span className="font-semibold">${selectedDashboardItem.expandedData.projectedRevenue.optimistic.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setSelectedDashboardItem(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;