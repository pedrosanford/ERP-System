import React, { useState, useEffect } from 'react';
import {
  FiTarget, FiUsers, FiTrendingUp, FiDollarSign, FiPhone, FiMail,
  FiCalendar, FiClock, FiMessageSquare, FiExternalLink, FiFilter,
  FiSearch, FiMapPin, FiBook, FiX, FiEdit, FiSave, FiPlus, FiCheck,
  FiUser, FiFileText, FiTrash2, FiSettings, FiMove
} from 'react-icons/fi';
import salesService from '../../services/salesService';
import type { Lead, Task, Communication, SalesStage, SalesStats } from '../../services/salesService';
import studentService from '../../services/studentService';

const Sales: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedDashboardItem, setSelectedDashboardItem] = useState<any | null>(null);
  const [draggedLead, setDraggedLead] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('bg-blue-500');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const [migrationTarget, setMigrationTarget] = useState<string>('');

  // API-driven state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [kanbanStages, setKanbanStages] = useState<any[]>([]);
  const [leadsData, setLeadsData] = useState<any[]>([]);
  const [allCommunications, setAllCommunications] = useState<Communication[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedLeadTasks, setSelectedLeadTasks] = useState<Task[]>([]);
  const [selectedLeadComms, setSelectedLeadComms] = useState<Communication[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCommModal, setShowCommModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', dueDate: '' });
  const [commForm, setCommForm] = useState({ type: 'CALL' as 'CALL' | 'EMAIL' | 'MEETING' | 'TEXT' | 'OTHER', summary: '' });
  const [editForm, setEditForm] = useState<any>(null);

  // New lead form state
  const [newLead, setNewLead] = useState({
    name: '',
    parentName: '',
    grade: '',
    program: '',
    enrollmentTerm: '',
    source: '',
    email: '',
    phone: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    estimatedTuitionValue: 0,
    scholarshipRequested: false,
    applicationFeeStatus: false,
    offerLetterSent: false,
    tuitionPaid: 0
  });

  // Load all data from API on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stages, leads, stats, communications, and tasks in parallel
      const [stagesData, leadsDataFromAPI, statsData, communicationsData, tasksData] = await Promise.all([
        salesService.getActiveStages(),
        salesService.getAllLeads(),
        salesService.getStats(),
        salesService.getAllCommunications(),
        salesService.getAllTasks()
      ]);

      // Transform stages to match kanban format
      const transformedStages = stagesData.map((stage: SalesStage) => ({
        id: stage.stageId,
        title: stage.title,
        color: stage.color,
        lineColor: stage.color,
        count: leadsDataFromAPI.filter((lead: Lead) => lead.status === stage.stageId).length
      }));

      setKanbanStages(transformedStages);
      setLeadsData(leadsDataFromAPI);
      setStats(statsData);
      setAllCommunications(communicationsData);
      setAllTasks(tasksData);
    } catch (err: any) {
      console.error('Failed to load sales data:', err);
      setError(err.message || 'Failed to load sales data. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLead = async (lead: any) => {
    setSelectedLead(lead);
    if (lead && lead.id) {
      try {
        const [tasks, comms] = await Promise.all([
          salesService.getLeadTasks(lead.id),
          salesService.getLeadCommunications(lead.id)
        ]);
        setSelectedLeadTasks(tasks);
        setSelectedLeadComms(comms);
      } catch (error) {
        console.error('Failed to load lead details:', error);
      }
    }
  };

  const handleCreateLead = async () => {
    // Validate required fields
    if (!newLead.name || !newLead.parentName || !newLead.email || !newLead.phone) {
      alert('Please fill in all required fields (Student Name, Parent Name, Email, Phone)');
      return;
    }

    try {
      // Create lead via API
      const leadData: any = {
        ...newLead,
        status: 'inquiry', // Default status for new leads
      };

      await salesService.createLead(leadData);

      // Close modal and reset form
      setShowAddLeadModal(false);
      setNewLead({
        name: '',
        parentName: '',
        grade: '',
        program: '',
        enrollmentTerm: '',
        source: '',
        email: '',
        phone: '',
        priority: 'MEDIUM',
        estimatedTuitionValue: 0,
        scholarshipRequested: false,
        applicationFeeStatus: false,
        offerLetterSent: false,
        tuitionPaid: 0
      });

      // Reload data to show new lead
      await loadAllData();

      alert('Lead created successfully!');
    } catch (err: any) {
      console.error('Failed to create lead:', err);
      alert('Failed to create lead: ' + (err.message || 'Unknown error'));
    }
  };

  // OLD MOCK DATA REMOVED - NOW LOADING FROM API
  /*const [leadsData, setLeadsData] = useState([
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
  ]); */

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

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (draggedLead) {
      try {
        // Get the lead being moved
        const lead = leadsData.find(l => l.id === draggedLead);
        
        if (!lead) return;

        // Update lead status on backend
        await salesService.updateLeadStatus(draggedLead, stageId);

        // Update local state immediately (optimistic update)
        const updatedLeads = leadsData.map(l => 
          l.id === draggedLead ? { ...l, status: stageId } : l
        );
        setLeadsData(updatedLeads);

        // Update stage counts based on updated leads
        setKanbanStages(prevStages => 
          prevStages.map(stage => ({
            ...stage,
            count: updatedLeads.filter(l => l.status === stage.id).length
          }))
        );

        // If moving to "enrolled" stage, automatically create a student
        if (stageId.toLowerCase() === 'enrolled' && lead) {
          // Pass the lead with updated status
          await handleEnrollment({ ...lead, status: stageId });
        }

        // Refresh stats in background without reloading everything
        salesService.getStats().then(setStats).catch(console.error);
      } catch (err: any) {
        console.error('Failed to update lead status:', err);
        alert('Failed to update lead: ' + (err.message || 'Unknown error'));
        // Reload data on error to sync with backend
        await loadAllData();
      }
    }
    setDraggedLead(null);
    setDragOverStage(null);
  };

  // Handle automatic student enrollment when lead is moved to "Enrolled" stage
  const handleEnrollment = async (lead: Lead) => {
    try {
      // Check if student already exists
      if (lead.studentId) {
        console.log('Student already enrolled with ID:', lead.studentId);
        return;
      }

      // Generate student ID
      const studentId = await generateStudentId();

      // Parse name
      const nameParts = lead.name.trim().split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || 'Student';

      // Generate a default date of birth if not provided (required field!)
      // Estimate based on grade: assume 6 years old in 1st grade + grade level
      const estimateAge = lead.grade ? 6 + parseInt(lead.grade.match(/\d+/)?.[0] || '0') : 18;
      const defaultDateOfBirth = new Date();
      defaultDateOfBirth.setFullYear(defaultDateOfBirth.getFullYear() - estimateAge);
      const dateOfBirth = defaultDateOfBirth.toISOString().split('T')[0];

      // Create student record from lead data
      const studentData = {
        studentId: studentId,
        firstName: firstName,
        lastName: lastName,
        email: lead.email,
        phone: lead.phone || '',
        dateOfBirth: dateOfBirth, // REQUIRED FIELD!
        program: lead.program || 'General Studies',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE' as const,
        feeStatus: (lead.tuitionPaid && lead.tuitionPaid > 0) ? 'PAID' as const : 'PENDING' as const,
        guardianName: lead.parentName || '',
        guardianPhone: lead.phone || '',
        guardianEmail: lead.email || '',
        currentSemester: 1,
        gpa: 0,
        attendancePercentage: 100
      };

      // Create student via Student Service
      const createdStudent = await studentService.createStudent(studentData);
      console.log('Student created successfully:', createdStudent);

      // Update the lead with the student ID AND status
      if (createdStudent.id && lead.id) {
        await salesService.updateLead(lead.id, {
          ...lead,
          status: 'enrolled', // Explicitly set status to "enrolled"
          studentId: createdStudent.studentId
        });
        
        // Update local state to reflect the changes
        setLeadsData(prevLeads => 
          prevLeads.map(l => 
            l.id === lead.id 
              ? { ...l, status: 'enrolled', studentId: createdStudent.studentId } 
              : l
          )
        );
      }

      // Show success message
      alert(`✅ Student enrolled successfully!\n\nStudent ID: ${studentId}\nName: ${lead.name}\n\nThe student has been added to the Students section.`);
    } catch (error: any) {
      console.error('Failed to create student from lead:', error);
      alert(`⚠️ Lead moved to Enrolled, but failed to create student record:\n${error.message}\n\nPlease manually create the student in the Students section.`);
    }
  };

  // Generate unique student ID
  const generateStudentId = async (): Promise<string> => {
    try {
      // Get all students to find the highest ID
      const students = await studentService.getAllStudents();
      
      if (students.length === 0) {
        return 'STU001';
      }

      // Find highest number
      const studentNumbers = students
        .map(s => s.studentId)
        .filter(id => id && id.startsWith('STU'))
        .map(id => parseInt(id.replace('STU', '')) || 0);
      
      const maxNumber = Math.max(...studentNumbers, 0);
      const nextNumber = maxNumber + 1;
      
      return `STU${String(nextNumber).padStart(3, '0')}`;
    } catch (error) {
      // Fallback to timestamp-based ID if service fails
      const timestamp = Date.now().toString().slice(-6);
      return `STU${timestamp}`;
    }
  };

  // Handle stage title editing
  const handleStageEdit = (stageId: string, newTitle: string) => {
    setKanbanStages(stages =>
      stages.map(stage =>
        stage.id === stageId ? { ...stage, title: newTitle } : stage
      )
    );
    setEditingStage(null);
  };

  // Handle adding new column
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newId = `custom-${Date.now()}`;
      const newStage = {
        id: newId,
        title: newColumnTitle.trim(),
        color: newColumnColor,
        lineColor: newColumnColor,
        count: 0
      };
      setKanbanStages(stages => [...stages, newStage]);
      setNewColumnTitle('');
      setNewColumnColor('bg-blue-500');
      setShowColumnModal(false);
    }
  };

  // Handle removing column
  const handleRemoveColumn = (stageId: string) => {
    const hasLeads = leadsData.some(lead => lead.status === stageId);
    const remainingStages = kanbanStages.filter(stage => stage.id !== stageId);

    // Prevent removing the last column
    if (remainingStages.length === 0) {
      alert('Cannot remove the last column. At least one column must remain.');
      return;
    }

    if (hasLeads) {
      // Show migration modal
      setColumnToDelete(stageId);
      setMigrationTarget(remainingStages[0].id); // Default to first remaining stage
      setShowDeleteModal(true);
    } else {
      // No leads, safe to delete
      setKanbanStages(stages => stages.filter(stage => stage.id !== stageId));
    }
  };

  // Handle column deletion with lead migration
  const handleConfirmDelete = () => {
    if (columnToDelete && migrationTarget) {
      // Migrate leads to target column
      setLeadsData(leads =>
        leads.map(lead =>
          lead.status === columnToDelete ? { ...lead, status: migrationTarget } : lead
        )
      );

      // Remove the column
      setKanbanStages(stages => stages.filter(stage => stage.id !== columnToDelete));

      // Reset state
      setShowDeleteModal(false);
      setColumnToDelete(null);
      setMigrationTarget('');
    }
  };

  // Column reordering handlers
  const handleColumnDragStart = (e: React.DragEvent, stageId: string) => {
    setDraggedColumn(stageId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'column', id: stageId }));
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== targetStageId) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumn(targetStageId);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== targetStageId) {
      const draggedIndex = kanbanStages.findIndex(s => s.id === draggedColumn);
      const targetIndex = kanbanStages.findIndex(s => s.id === targetStageId);

      const newStages = [...kanbanStages];
      const draggedItem = newStages.splice(draggedIndex, 1)[0];
      newStages.splice(targetIndex, 0, draggedItem);

      setKanbanStages(newStages);
    }
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Filter leads based on search term and selected filter
  const filteredLeads = leadsData.filter(lead => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase());

    // Grade filter
    const matchesGradeFilter = selectedFilter === 'all' ||
      (selectedFilter === 'elementary' && ['K', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'].includes(lead.grade)) ||
      (selectedFilter === 'middle' && ['6th Grade', '7th Grade', '8th Grade'].includes(lead.grade)) ||
      (selectedFilter === 'high' && ['9th Grade', '10th Grade', '11th Grade', '12th Grade'].includes(lead.grade));

    return matchesSearch && matchesGradeFilter;
  });

  // Calculate real data from leadsData for dashboard
  const sourceBreakdown = leadsData.reduce((acc: any, lead) => {
    const source = lead.source || 'Other';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const sourcesArray = Object.entries(sourceBreakdown).map(([source, count]) => ({
    source,
    count: count as number,
    percentage: stats?.totalLeads ? Math.round((count as number / stats.totalLeads) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  // Top lead source
  const topLeadSource = sourcesArray.length > 0 ? sourcesArray[0] : { source: 'None', count: 0, percentage: 0 };

  // Follow-ups due today - available for future dashboard widgets
  const today = new Date().toISOString().split('T')[0];
  void today; // used in commented code below
  /* Future: Follow-ups tracking
  const followUpsToday = leadsData.filter((lead: any) => {
    if (!lead.nextFollowUpDate) return false;
    const followUpDate = new Date(lead.nextFollowUpDate).toISOString().split('T')[0];
    return followUpDate === today;
  });

  const overdueFollowUps = leadsData.filter((lead: any) => {
    if (!lead.nextFollowUpDate) return false;
    const followUpDate = new Date(lead.nextFollowUpDate);
    const todayDate = new Date(today);
    return followUpDate < todayDate;
  });
  */

  // Dashboard data with detailed information (using real stats from API)
  const dashboardItems = [
    {
      id: 'new-leads',
      title: 'New Leads',
      value: stats ? stats.newLeads.toString() : '0',
      icon: FiUsers,
      color: 'text-blue-500',
      subtitle: `Total: ${stats?.totalLeads || 0} leads`,
      expandedData: {
        monthlyData: [
          { month: 'Current', leads: stats?.totalLeads || 0, change: 'All time' }
        ],
        sources: sourcesArray
      }
    },
    {
      id: 'applications',
      title: 'Overdue Tasks',
      value: stats ? stats.overdueTasks.toString() : '0',
      icon: FiClock,
      color: 'text-orange-500',
      subtitle: 'Tasks needing attention',
      expandedData: {
        statusBreakdown: kanbanStages.slice(0, 5).map(stage => ({
          status: stage.title,
          count: leadsData.filter((l: any) => l.status === stage.id).length,
          percentage: stats?.totalLeads ? Math.round((leadsData.filter((l: any) => l.status === stage.id).length / stats.totalLeads) * 100) : 0
        })),
        weeklyProgress: [
          { week: 'All Time', started: stats?.totalLeads || 0, completed: stats?.enrolledCount || 0 }
        ]
      }
    },
    {
      id: 'conversion',
      title: 'Enrollment Conversion',
      value: stats ? `${stats.conversionRate.toFixed(1)}%` : '0%',
      icon: FiTarget,
      color: 'text-green-500',
      subtitle: `${stats?.enrolledCount || 0} enrolled`,
      expandedData: {
        conversionFunnel: kanbanStages.map(stage => {
          const count = leadsData.filter((l: any) => l.status === stage.id).length;
          return {
            stage: stage.title,
            count,
            percentage: stats?.totalLeads && stats.totalLeads > 0 ? Math.round((count / stats.totalLeads) * 100) : 0
          };
        }),
        monthlyTrends: [
          { month: 'Current', rate: stats?.conversionRate || 0 }
        ]
      }
    },
    {
      id: 'pipeline-value',
      title: 'Pipeline Value',
      value: stats ? `$${(stats.potentialRevenue / 1000).toFixed(0)}K` : '$0',
      icon: FiDollarSign,
      color: 'text-purple-500',
      subtitle: `${stats?.scholarshipRequests || 0} scholarship requests`,
      expandedData: {
        stageValues: kanbanStages.map(stage => {
          const leadsInStage = leadsData.filter((l: any) => l.status === stage.id);
          const totalValue = leadsInStage.reduce((sum: number, lead: any) => sum + (lead.estimatedTuitionValue || 0), 0);
          return {
            stage: stage.title,
            value: totalValue,
            count: leadsInStage.length
          };
        }).filter(s => s.count > 0),
        projectedRevenue: {
          conservative: Math.round((stats?.potentialRevenue ?? 0) * 0.75),
          realistic: Math.round(stats?.potentialRevenue ?? 0),
          optimistic: Math.round((stats?.potentialRevenue ?? 0) * 1.2)
        }
      }
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading Sales Data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your leads and pipeline</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Make sure the backend services are running:
            </p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              Sales Service: http://localhost:8084
            </code>
          </div>
          <button
            onClick={loadAllData}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FiTarget className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sales & Admissions</h2>
            <p className="text-sm text-gray-600">Manage student recruitment and enrollment pipeline</p>
          </div>
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
        <div
          onClick={() => setSelectedDashboardItem({
            id: 'upcoming-events',
            title: 'Upcoming Events',
            value: '0',
            subtitle: 'No events scheduled',
            expandedData: {
              events: []
            }
          })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FiCalendar className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">No events scheduled</p>
        </div>

        <div
          onClick={() => setSelectedDashboardItem({
            id: 'top-lead-source',
            title: 'Top Lead Source',
            value: topLeadSource.source,
            subtitle: `${topLeadSource.percentage}% of all leads`,
            expandedData: {
              sources: sourcesArray,
              topPerformers: []
            }
          })}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Lead Source</p>
              <p className="text-xl font-bold text-gray-900">{topLeadSource.source}</p>
            </div>
            <FiMapPin className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">{topLeadSource.percentage}% of all leads</p>
        </div>

        <div
          onClick={() => {
            const tasksToday = allTasks.filter(t => t.dueDate === today && !t.completed);
            const overdueTasks = allTasks.filter(t => {
              if (!t.dueDate || t.completed) return false;
              return new Date(t.dueDate) < new Date(today);
            });
            const upcomingTasks = allTasks.filter(t => {
              if (!t.dueDate || t.completed) return false;
              const dueDate = new Date(t.dueDate);
              const todayDate = new Date(today);
              const fiveDaysFromNow = new Date(todayDate);
              fiveDaysFromNow.setDate(todayDate.getDate() + 5);
              return dueDate > todayDate && dueDate <= fiveDaysFromNow;
            });

            setSelectedDashboardItem({
              id: 'follow-ups',
              title: 'Follow-ups Due Today',
              value: tasksToday.length.toString(),
              subtitle: `${overdueTasks.length} overdue`,
              expandedData: {
                todayFollowUps: tasksToday.map(task => {
                  const lead = leadsData.find(l => l.id === task.leadId);
                  return {
                    id: task.id,
                    leadName: lead?.name || 'Unknown Lead',
                    type: 'Task',
                    time: task.dueDate,
                    priority: 'medium',
                    notes: task.title
                  };
                }),
                overdueFollowUps: overdueTasks.map(task => {
                  const lead = leadsData.find(l => l.id === task.leadId);
                  const daysOverdue = Math.floor((new Date(today).getTime() - new Date(task.dueDate!).getTime()) / (1000 * 60 * 60 * 24));
                  return {
                    id: task.id,
                    leadName: lead?.name || 'Unknown Lead',
                    type: 'Task',
                    daysOverdue,
                    priority: 'high',
                    notes: task.title
                  };
                }),
                upcomingTasks: upcomingTasks.map(task => {
                  const lead = leadsData.find(l => l.id === task.leadId);
                  return {
                    id: task.id,
                    leadName: lead?.name || 'Unknown Lead',
                    dueDate: task.dueDate,
                    notes: task.title
                  };
                })
              }
            });
          }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Follow-ups Due Today</p>
              <p className="text-2xl font-bold text-gray-900">{allTasks.filter(t => t.dueDate === today && !t.completed).length}</p>
            </div>
            <FiClock className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-sm text-red-600 mt-2">{allTasks.filter(t => t.dueDate && !t.completed && new Date(t.dueDate) < new Date(today)).length} overdue</p>
        </div>

        <div
          onClick={() => {
            const emailCount = allCommunications.filter(c => c.type === 'EMAIL').length;
            const callCount = allCommunications.filter(c => c.type === 'CALL').length;
            const meetingCount = allCommunications.filter(c => c.type === 'MEETING').length;
            const textCount = allCommunications.filter(c => c.type === 'TEXT').length;
            const recentComms = allCommunications
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 10)
              .map(comm => {
                const lead = leadsData.find(l => l.id === comm.leadId);
                return {
                  id: comm.id,
                  type: comm.type.toLowerCase(),
                  leadName: lead?.name || 'Unknown Lead',
                  subject: comm.summary,
                  timestamp: comm.timestamp,
                  status: 'completed'
                };
              });

            setSelectedDashboardItem({
              id: 'communications',
              title: 'Communications',
              value: allCommunications.length.toString(),
              subtitle: `${emailCount} emails, ${callCount} calls`,
              expandedData: {
                summary: {
                  totalThisMonth: allCommunications.length,
                  emails: emailCount,
                  calls: callCount,
                  meetings: meetingCount,
                  texts: textCount
                },
                recentActivity: recentComms,
                responseRates: {
                  email: 0,
                  call: 0,
                  text: 0
                }
              }
            });
          }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Communications</p>
              <p className="text-2xl font-bold text-gray-900">{allCommunications.length}</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-cyan-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {allCommunications.filter(c => c.type === 'EMAIL').length} emails, {allCommunications.filter(c => c.type === 'CALL').length} calls
          </p>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Total Pipeline: <span className="font-semibold">{filteredLeads.length} leads</span>
                {searchTerm && (
                  <span className="ml-2 text-blue-600">
                    (filtered from {leadsData.length})
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowColumnModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <FiSettings className="w-4 h-4" />
                <span>Manage Columns</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanStages.map((stage) => {
              const isDraggedOver = dragOverStage === stage.id;
              const isColumnDraggedOver = dragOverColumn === stage.id;
              const isColumnBeingDragged = draggedColumn === stage.id;
              const stageLeads = filteredLeads.filter(lead => lead.status === stage.id);

              return (
                <div
                  key={stage.id}
                  className={`min-w-80 flex-shrink-0 bg-gray-50 rounded-lg transition-all duration-200 ${
                    isDraggedOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
                  } ${
                    isColumnDraggedOver ? 'bg-green-50 ring-2 ring-green-300' : ''
                  } ${
                    isColumnBeingDragged ? 'opacity-50' : ''
                  }`}
                  onDragOver={(e) => {
                    handleDragOver(e, stage.id);
                    handleColumnDragOver(e, stage.id);
                  }}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    handleDrop(e, stage.id);
                    handleColumnDrop(e, stage.id);
                  }}
                >
                <div
                  className="p-4 border-b border-gray-200 relative cursor-move"
                  draggable
                  onDragStart={(e) => handleColumnDragStart(e, stage.id)}
                  onDragEnd={handleColumnDragEnd}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1">
                      {/* Drag handle */}
                      <FiMove className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />

                      {editingStage === stage.id ? (
                        <input
                          type="text"
                          defaultValue={stage.title}
                          className="font-medium text-gray-900 text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                          onBlur={(e) => handleStageEdit(stage.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleStageEdit(stage.id, e.currentTarget.value);
                            }
                            if (e.key === 'Escape') {
                              setEditingStage(null);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <h4
                          className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600 flex items-center group flex-1"
                          onClick={() => setEditingStage(stage.id)}
                        >
                          {stage.title}
                          <FiEdit className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                      )}

                      {/* Delete button for all columns */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveColumn(stage.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete column"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className={`text-xs text-white px-2 py-1 rounded-full ${stage.color}`}>
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${stage.lineColor} rounded-b-sm`}></div>

                  {isDraggedOver && (
                    <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-t-lg flex items-center justify-center">
                      <span className="text-blue-700 font-medium text-sm">Drop lead here</span>
                    </div>
                  )}

                  {isColumnDraggedOver && (
                    <div className="absolute inset-0 bg-green-100 bg-opacity-50 rounded-t-lg flex items-center justify-center">
                      <span className="text-green-700 font-medium text-sm">Reorder column here</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-4 min-h-96 max-h-[600px] overflow-y-auto">
                  {stageLeads.map((lead) => (
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
                          onClick={() => handleSelectLead(lead)}
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
                  {stageLeads.length === 0 && isDraggedOver && (
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
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(null);
                    }}
                    className="px-3 py-1 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <FiX className="w-4 h-4 inline mr-1" />
                    Cancel
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (isEditing && editForm && selectedLead?.id) {
                      // Save changes
                      try {
                        await salesService.updateLead(selectedLead.id, editForm);
                        // Reload all data
                        await loadAllData();
                        // Update selected lead with new data
                        const updatedLead = leadsData.find(l => l.id === selectedLead.id);
                        if (updatedLead) {
                          setSelectedLead(updatedLead);
                        }
                        setIsEditing(false);
                        setEditForm(null);
                        alert('✅ Lead updated successfully!');
                      } catch (error: any) {
                        alert('Failed to save changes: ' + error.message);
                      }
                    } else {
                      // Enter edit mode
                      setIsEditing(true);
                      setEditForm({ ...selectedLead });
                    }
                  }}
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
                  onClick={() => {
                    setSelectedLead(null);
                    setIsEditing(false);
                    setEditForm(null);
                  }}
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
                      value={isEditing && editForm ? editForm.name : selectedLead.name}
                      onChange={(e) => isEditing && setEditForm({...editForm, name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                    <input
                      type="text"
                      value={isEditing && editForm ? editForm.parentName : selectedLead.parentName}
                      onChange={(e) => isEditing && setEditForm({...editForm, parentName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                    <input
                      type="text"
                      value={isEditing && editForm ? editForm.grade : selectedLead.grade}
                      onChange={(e) => isEditing && setEditForm({...editForm, grade: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Interest</label>
                    <input
                      type="text"
                      value={isEditing && editForm ? editForm.program : selectedLead.program}
                      onChange={(e) => isEditing && setEditForm({...editForm, program: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                    <input
                      type="text"
                      value={isEditing && editForm ? editForm.source : selectedLead.source}
                      onChange={(e) => isEditing && setEditForm({...editForm, source: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Term</label>
                    <input
                      type="text"
                      value={isEditing && editForm ? editForm.enrollmentTerm : selectedLead.enrollmentTerm}
                      onChange={(e) => isEditing && setEditForm({...editForm, enrollmentTerm: e.target.value})}
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
                      value={isEditing && editForm ? editForm.email : selectedLead.email}
                      onChange={(e) => isEditing && setEditForm({...editForm, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={isEditing && editForm ? editForm.phone : selectedLead.phone}
                      onChange={(e) => isEditing && setEditForm({...editForm, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                    <select
                      value={isEditing && editForm ? (editForm.preferredContactMethod || 'email') : (selectedLead.preferredContactMethod || 'email')}
                      onChange={(e) => isEditing && setEditForm({...editForm, preferredContactMethod: e.target.value})}
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
                      value={isEditing && editForm ? (editForm.assignedRecruiter || '') : (selectedLead.assignedRecruiter || '')}
                      onChange={(e) => isEditing && setEditForm({...editForm, assignedRecruiter: e.target.value})}
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
                      value={isEditing && editForm ? editForm.status : selectedLead.status}
                      onChange={(e) => isEditing && setEditForm({...editForm, status: e.target.value})}
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
                      value={isEditing && editForm ? editForm.priority : selectedLead.priority}
                      onChange={(e) => isEditing && setEditForm({...editForm, priority: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Fee Status</label>
                    <select
                      value={isEditing && editForm ? (editForm.applicationFeeStatus ? 'paid' : 'pending') : (selectedLead.applicationFeeStatus ? 'paid' : 'pending')}
                      onChange={(e) => isEditing && setEditForm({...editForm, applicationFeeStatus: e.target.value === 'paid'})}
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
                      value={isEditing && editForm ? (editForm.submissionDate || '') : (selectedLead.submissionDate || '')}
                      onChange={(e) => isEditing && setEditForm({...editForm, submissionDate: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
                    <input
                      type="date"
                      value={isEditing && editForm ? (editForm.interviewDate || '') : (selectedLead.interviewDate || '')}
                      onChange={(e) => isEditing && setEditForm({...editForm, interviewDate: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                    <input
                      type="text"
                      value={isEditing && editForm ? (editForm.interviewer || '') : (selectedLead.interviewer || '')}
                      onChange={(e) => isEditing && setEditForm({...editForm, interviewer: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Notes</label>
                  <textarea
                    value={isEditing && editForm ? (editForm.statusNotes || '') : (selectedLead.statusNotes || '')}
                    onChange={(e) => isEditing && setEditForm({...editForm, statusNotes: e.target.value})}
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
                  {selectedLeadTasks.map((task: Task) => (
                    <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={async (e) => {
                            if (task.id) {
                              await salesService.updateTask(task.id, { completed: e.target.checked });
                              const updated = await salesService.getLeadTasks(selectedLead.id!);
                              setSelectedLeadTasks(updated);
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{task.dueDate || 'No date'}</span>
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors"
                    >
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
                  {selectedLeadComms.map((comm: Communication) => (
                    <div key={comm.id} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            comm.type === 'EMAIL' ? 'bg-blue-100 text-blue-700' :
                            comm.type === 'CALL' ? 'bg-green-100 text-green-700' :
                            comm.type === 'MEETING' ? 'bg-purple-100 text-purple-700' :
                            comm.type === 'TEXT' ? 'bg-pink-100 text-pink-700' :
                            'bg-gray-100 text-gray-700'
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
                    <button
                      onClick={() => setShowCommModal(true)}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 transition-colors"
                    >
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
                      value={isEditing && editForm ? (editForm.estimatedTuitionValue || '') : (selectedLead.estimatedTuitionValue || '')}
                      onChange={(e) => isEditing && setEditForm({...editForm, estimatedTuitionValue: parseFloat(e.target.value) || 0})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Requested</label>
                    <select
                      value={isEditing && editForm ? (editForm.scholarshipRequested ? 'yes' : 'no') : (selectedLead.scholarshipRequested ? 'yes' : 'no')}
                      onChange={(e) => isEditing && setEditForm({...editForm, scholarshipRequested: e.target.value === 'yes'})}
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
                      value={isEditing && editForm ? (editForm.scholarshipAmount || '') : (selectedLead.scholarshipAmount || '')}
                      onChange={(e) => isEditing && setEditForm({...editForm, scholarshipAmount: parseFloat(e.target.value) || 0})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Paid</label>
                    <input
                      type="number"
                      value={isEditing && editForm ? (editForm.tuitionPaid || '') : (selectedLead.tuitionPaid || '')}
                      onChange={(e) => isEditing && setEditForm({...editForm, tuitionPaid: parseFloat(e.target.value) || 0})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Notes</label>
                  <textarea
                    value={isEditing && editForm ? (editForm.scholarshipNotes || '') : (selectedLead.scholarshipNotes || '')}
                    onChange={(e) => isEditing && setEditForm({...editForm, scholarshipNotes: e.target.value})}
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
                  value={isEditing && editForm ? (editForm.notes || '') : (selectedLead.notes || '')}
                  onChange={(e) => isEditing && setEditForm({...editForm, notes: e.target.value})}
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
                onClick={() => {
                  setSelectedLead(null);
                  setIsEditing(false);
                  setEditForm(null);
                }}
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
                      value={newLead.name}
                      onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter student name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name *</label>
                    <input
                      type="text"
                      value={newLead.parentName}
                      onChange={(e) => setNewLead({...newLead, parentName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter parent name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
                    <select
                      value={newLead.grade}
                      onChange={(e) => setNewLead({...newLead, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                    <select
                      value={newLead.program}
                      onChange={(e) => setNewLead({...newLead, program: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                    <select
                      value={newLead.enrollmentTerm}
                      onChange={(e) => setNewLead({...newLead, enrollmentTerm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select term</option>
                      <option value="Fall 2025">Fall 2025</option>
                      <option value="Spring 2026">Spring 2026</option>
                      <option value="Fall 2026">Fall 2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
                    <select
                      value={newLead.source}
                      onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                      value={newLead.email}
                      onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                    <select
                      value={newLead.priority}
                      onChange={(e) => setNewLead({...newLead, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
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
                      value={newLead.estimatedTuitionValue}
                      onChange={(e) => setNewLead({...newLead, estimatedTuitionValue: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter estimated value"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="scholarshipRequested"
                    checked={newLead.scholarshipRequested}
                    onChange={(e) => setNewLead({...newLead, scholarshipRequested: e.target.checked})}
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
                onClick={handleCreateLead}
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

              {selectedDashboardItem.id === 'upcoming-events' && (
                <>
                  {/* Events List */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                      <button
                        onClick={() => alert('Event creation functionality coming soon!')}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Create Event</span>
                      </button>
                    </div>
                    {selectedDashboardItem.expandedData.events.length > 0 ? (
                      <div className="space-y-4">
                        {selectedDashboardItem.expandedData.events.map((event: any) => (
                          <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900">{event.title}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                event.type === 'Open House' ? 'bg-blue-100 text-blue-700' :
                                event.type === 'Virtual' ? 'bg-purple-100 text-purple-700' :
                                event.type === 'Tour' ? 'bg-green-100 text-green-700' :
                                event.type === 'Showcase' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {event.type}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <FiCalendar className="w-4 h-4 mr-2" />
                                {new Date(event.date).toLocaleDateString()} at {event.time}
                              </div>
                              <div className="flex items-center">
                                <FiMapPin className="w-4 h-4 mr-2" />
                                {event.location}
                              </div>
                              <div className="flex items-center">
                                <FiUsers className="w-4 h-4 mr-2" />
                                {event.attendees} attendees expected
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No upcoming events scheduled</p>
                        <p className="text-sm text-gray-500 mt-1">Click "Create Event" to add a new event</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedDashboardItem.id === 'top-lead-source' && (
                <>
                  {/* Lead Sources Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources Breakdown</h3>
                    <div className="space-y-4">
                      {selectedDashboardItem.expandedData.sources.map((source: any, index: number) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-900">{source.source}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{source.count} leads</span>
                              <span className="text-gray-500">({source.percentage}%)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedDashboardItem.id === 'follow-ups' && (
                <>
                  {/* Today's Follow-ups */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Follow-ups</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.todayFollowUps.map((followUp: any) => (
                        <div key={followUp.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{followUp.leadName}</h4>
                              <p className="text-sm text-gray-600">{followUp.notes}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                followUp.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {followUp.priority}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              {followUp.type === 'Call' ? <FiPhone className="w-4 h-4 mr-1" /> :
                               followUp.type === 'Email' ? <FiMail className="w-4 h-4 mr-1" /> :
                               <FiCalendar className="w-4 h-4 mr-1" />}
                              {followUp.type}
                            </span>
                            <span>{followUp.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overdue Follow-ups */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Follow-ups</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.overdueFollowUps.map((followUp: any) => (
                        <div key={followUp.id} className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{followUp.leadName}</h4>
                              <p className="text-sm text-gray-600">{followUp.notes}</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                              {followUp.daysOverdue} day{followUp.daysOverdue > 1 ? 's' : ''} overdue
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            {followUp.type === 'Call' ? <FiPhone className="w-4 h-4 mr-1" /> : <FiMail className="w-4 h-4 mr-1" />}
                            {followUp.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Tasks (Next 5 Days) */}
                  {selectedDashboardItem.expandedData.upcomingTasks && selectedDashboardItem.expandedData.upcomingTasks.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks (Next 5 Days)</h3>
                      <div className="space-y-3">
                        {selectedDashboardItem.expandedData.upcomingTasks.map((task: any) => (
                          <div key={task.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{task.leadName}</h4>
                                <p className="text-sm text-gray-600">{task.notes}</p>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                {task.dueDate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedDashboardItem.id === 'communications' && (
                <>
                  {/* Communication Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedDashboardItem.expandedData.summary.emails}</div>
                        <div className="text-sm text-gray-600">Emails</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedDashboardItem.expandedData.summary.calls}</div>
                        <div className="text-sm text-gray-600">Calls</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedDashboardItem.expandedData.summary.meetings}</div>
                        <div className="text-sm text-gray-600">Meetings</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedDashboardItem.expandedData.summary.texts}</div>
                        <div className="text-sm text-gray-600">Texts</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {selectedDashboardItem.expandedData.recentActivity.map((activity: any) => (
                        <div key={activity.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {activity.type === 'email' ? <FiMail className="w-4 h-4 text-blue-500" /> :
                                 activity.type === 'call' ? <FiPhone className="w-4 h-4 text-green-500" /> :
                                 <FiCalendar className="w-4 h-4 text-purple-500" />}
                                <span className="font-medium text-gray-900">{activity.leadName}</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {activity.subject || `${activity.duration} call`}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                                activity.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                activity.status === 'opened' ? 'bg-purple-100 text-purple-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {activity.status}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Rates */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rates</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Email Response Rate</span>
                        <span className="font-semibold">{selectedDashboardItem.expandedData.responseRates.email}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Call Success Rate</span>
                        <span className="font-semibold">{selectedDashboardItem.expandedData.responseRates.call}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Text Response Rate</span>
                        <span className="font-semibold">{selectedDashboardItem.expandedData.responseRates.text}%</span>
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

      {/* Column Management Modal */}
      {showColumnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Column</h2>
              <button
                onClick={() => {
                  setShowColumnModal(false);
                  setNewColumnTitle('');
                  setNewColumnColor('bg-blue-500');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Column Title</label>
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Enter column title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddColumn();
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Column Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    'bg-blue-500',
                    'bg-green-500',
                    'bg-yellow-500',
                    'bg-red-500',
                    'bg-purple-500',
                    'bg-pink-500',
                    'bg-indigo-500',
                    'bg-orange-500',
                    'bg-teal-500',
                    'bg-cyan-500',
                    'bg-gray-500',
                    'bg-emerald-500'
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColumnColor(color)}
                      className={`w-8 h-8 ${color} rounded-lg border-2 transition-all ${
                        newColumnColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {newColumnTitle || 'Column Title'}
                    </span>
                    <span className={`text-xs text-white px-2 py-1 rounded-full ${newColumnColor}`}>
                      0
                    </span>
                  </div>
                  <div className={`h-1 ${newColumnColor} rounded`}></div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowColumnModal(false);
                  setNewColumnTitle('');
                  setNewColumnColor('bg-blue-500');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                disabled={!newColumnTitle.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Column with Lead Migration Modal */}
      {showDeleteModal && columnToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Delete Column</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setColumnToDelete(null);
                  setMigrationTarget('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 text-orange-600 bg-orange-50 p-3 rounded-lg">
                <FiUsers className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  This column contains {leadsData.filter(lead => lead.status === columnToDelete).length} lead(s).
                  Where should these leads be moved?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Move leads to:
                </label>
                <select
                  value={migrationTarget}
                  onChange={(e) => setMigrationTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {kanbanStages
                    .filter(stage => stage.id !== columnToDelete)
                    .map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Leads to be moved:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {leadsData
                    .filter(lead => lead.status === columnToDelete)
                    .map((lead) => (
                      <div key={lead.id} className="text-sm text-gray-600 bg-white p-2 rounded border">
                        {lead.name} - {lead.parentName}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setColumnToDelete(null);
                  setMigrationTarget('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Column & Move Leads
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTaskModal(false)}>
          <div className="bg-white rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Create Task for {selectedLead.name}</h3>
            <input
              type="text"
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={async () => {
                if (!taskForm.title) { alert('Please enter a task title'); return; }
                try {
                  await salesService.createTask({ leadId: selectedLead.id!, title: taskForm.title, dueDate: taskForm.dueDate, completed: false });
                  const updatedTasks = await salesService.getLeadTasks(selectedLead.id!);
                  setSelectedLeadTasks(updatedTasks);
                  setShowTaskModal(false);
                  setTaskForm({ title: '', dueDate: '' });
                  await loadAllData();
                  alert('✅ Task created successfully!');
                } catch (error: any) {
                  alert('Failed to create task: ' + error.message);
                }
              }} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {showCommModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCommModal(false)}>
          <div className="bg-white rounded-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Log Communication for {selectedLead.name}</h3>
            <select
              value={commForm.type}
              onChange={(e) => setCommForm({...commForm, type: e.target.value as any})}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="CALL">Call</option>
              <option value="EMAIL">Email</option>
              <option value="MEETING">Meeting</option>
              <option value="TEXT">Text</option>
              <option value="OTHER">Other</option>
            </select>
            <textarea
              placeholder="Summary of communication..."
              value={commForm.summary}
              onChange={(e) => setCommForm({...commForm, summary: e.target.value})}
              className="w-full p-2 border rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowCommModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={async () => {
                if (!commForm.summary) { alert('Please enter a summary'); return; }
                try {
                  await salesService.createCommunication({ leadId: selectedLead.id!, type: commForm.type, summary: commForm.summary, timestamp: new Date().toISOString(), followUpRequired: false });
                  const updatedComms = await salesService.getLeadCommunications(selectedLead.id!);
                  setSelectedLeadComms(updatedComms);
                  setShowCommModal(false);
                  setCommForm({ type: 'CALL', summary: '' });
                  await loadAllData();
                  alert('✅ Communication logged successfully!');
                } catch (error: any) {
                  alert('Failed to log communication: ' + error.message);
                }
              }} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;