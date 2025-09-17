export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Communication {
  id: string;
  type: 'call' | 'email' | 'meeting';
  summary: string;
  timestamp: string;
  followUpRequired?: boolean;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'longtext' | 'dropdown' | 'multiselect' | 'number' | 'currency' | 'percentage' | 'date' | 'time' | 'datetime' | 'checkbox' | 'rating' | 'progress' | 'file' | 'url' | 'image' | 'lookup' | 'user' | 'signature';
  required: boolean;
  options?: string[];
  defaultValue?: any;
  placeholder?: string;
  value?: any;
  order?: number;
  columnId?: string;
}

export interface KanbanStage {
  id: string;
  title: string;
  color: string;
  lineColor: string;
  count: number;
  customFields?: CustomField[];
  isRequired?: boolean;
  order?: number;
}

export interface Lead {
  id: number;
  name: string;
  parentName: string;
  grade: string;
  program: string;
  source: string;
  enrollmentTerm: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
  followUpDate: string;
  phone: string;
  email: string;
  preferredContactMethod?: string;
  assignedRecruiter?: string;
  statusNotes?: string;
  nextFollowUpDate?: string;
  taskChecklist?: Task[];
  communicationLog?: Communication[];
  estimatedTuitionValue?: number;
  scholarshipRequested?: boolean;
  scholarshipNotes?: string;
  scholarshipAmount?: number;
  applicationFeeStatus?: boolean;
  submissionDate?: string;
  interviewDate?: string;
  interviewer?: string;
  enrollmentDeadline?: string;
  offerLetterSent?: boolean;
  tuitionPaid?: number;
  studentId?: string;
  dormAssigned?: string;
  customFieldValues?: Record<string, any>;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  icon: any;
  color: string;
  subtitle?: string;
  trend?: string;
  expandedData?: any;
}