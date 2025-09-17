import React, { useState } from 'react';
import { 
  FiTarget, FiUsers, FiTrendingUp, FiDollarSign, FiPhone, FiMail, 
  FiCalendar, FiClock, FiMessageSquare, FiExternalLink, FiFilter,
  FiSearch, FiMapPin, FiBook, FiStar, FiMoreHorizontal
} from 'react-icons/fi';

const Sales: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const kanbanStages = [
    { id: 'inquiry', title: 'New Inquiry', color: 'bg-blue-500', lineColor: 'bg-blue-500', count: 12 },
    { id: 'contacted', title: 'Contacted', color: 'bg-yellow-500', lineColor: 'bg-yellow-500', count: 8 },
    { id: 'application-started', title: 'Application Started', color: 'bg-orange-500', lineColor: 'bg-orange-500', count: 6 },
    { id: 'application-submitted', title: 'Application Submitted', color: 'bg-purple-500', lineColor: 'bg-purple-500', count: 4 },
    { id: 'interview-scheduled', title: 'Interview/Tour Scheduled', color: 'bg-indigo-500', lineColor: 'bg-indigo-500', count: 3 },
    { id: 'accepted', title: 'Accepted/Offered', color: 'bg-green-500', lineColor: 'bg-green-500', count: 5 },
    { id: 'enrolled', title: 'Enrolled', color: 'bg-emerald-500', lineColor: 'bg-emerald-500', count: 2 },
    { id: 'lost', title: 'Lost/Not Interested', color: 'bg-gray-500', lineColor: 'bg-gray-500', count: 3 }
  ];

  const leads = [
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
      email: 'mike.johnson@email.com'
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
      email: 'lisa.chen@email.com'
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
      email: 'carlos.rodriguez@email.com'
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
      email: 'jennifer.kim@email.com'
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
      email: 'robert.williams@email.com'
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
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <FiUsers className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Row 1 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Leads This Month</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+23% from last month</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applications in Progress</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <FiClock className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">6 started this week</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrollment Conversion</p>
              <p className="text-2xl font-bold text-gray-900">24.5%</p>
            </div>
            <FiTarget className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+3.2% improvement</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">$287K</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Potential tuition revenue</p>
        </div>

        {/* Row 2 */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <FiCalendar className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">3 open houses this week</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Lead Source</p>
              <p className="text-xl font-bold text-gray-900">School Fairs</p>
            </div>
            <FiMapPin className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">32% of all leads</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Follow-ups Due Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <FiClock className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-red-600 mt-2">5 overdue from yesterday</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
              Total Pipeline: <span className="font-semibold">43 leads</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanStages.map((stage) => (
              <div key={stage.id} className="min-w-80 flex-shrink-0 bg-gray-50 rounded-lg">
                <div className="p-4 border-b border-gray-200 relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{stage.title}</h4>
                    <span className={`text-xs text-white px-2 py-1 rounded-full ${stage.color}`}>
                      {stage.count}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${stage.lineColor} rounded-b-sm`}></div>
                </div>
                
                <div className="p-4 space-y-4 min-h-96 max-h-[600px] overflow-y-auto">
                  {leads
                    .filter(lead => lead.status === stage.id)
                    .map((lead) => (
                      <div key={lead.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer">
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
                              <FiMoreHorizontal className="w-3 h-3 text-gray-400" />
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
                          {lead.notes && (
                            <div className="bg-gray-50 p-2 rounded text-xs mt-2">
                              <span className="font-medium">Note:</span>
                              <span className="block mt-1 break-words">{lead.notes}</span>
                            </div>
                          )}
                          <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-primary-600 truncate">
                                Follow-up: {lead.followUpDate}
                              </span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Call">
                                <FiPhone className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Email">
                                <FiMail className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="View Details">
                                <FiExternalLink className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Add New Lead Card */}
                  <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-white/80 transition-all duration-200 cursor-pointer">
                    <FiUsers className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Add Lead</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;