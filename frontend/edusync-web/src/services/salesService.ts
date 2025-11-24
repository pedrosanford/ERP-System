const API_BASE_URL = import.meta.env.VITE_SALES_API_URL || 'http://localhost:8084'; // Sales Service Direct URL
const SALES_SERVICE_URL = `${API_BASE_URL}/sales`;

// ============================================================
// INTERFACES - Match backend DTOs exactly
// ============================================================

export interface Lead {
    id?: number;
    name: string;
    parentName: string;
    grade: string;
    program: string;
    source: string;
    enrollmentTerm: string;
    status: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    phone: string;
    email: string;
    estimatedTuitionValue: number;
    scholarshipRequested: boolean;
    scholarshipAmount?: number;
    scholarshipNotes?: string;
    applicationFeeStatus: boolean;
    submissionDate?: string; // ISO date
    interviewDate?: string; // ISO date
    interviewer?: string;
    enrollmentDeadline?: string; // ISO date
    offerLetterSent: boolean;
    tuitionPaid: number;
    studentId?: string;
    dormAssigned?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Task {
    id?: number;
    leadId: number;
    title: string;
    completed: boolean;
    dueDate?: string; // ISO date
}

export interface Communication {
    id?: number;
    leadId: number;
    type: 'EMAIL' | 'CALL' | 'MEETING' | 'TEXT' | 'OTHER';
    summary: string;
    timestamp: string; // ISO datetime
    followUpRequired: boolean;
}

export interface SalesStage {
    stageId: string;
    title: string;
    color: string;
    sortOrder: number;
    isActive: boolean;
    isSystemDefault: boolean;
}

export interface SalesStats {
    totalLeads: number;
    newLeads: number;
    enrolledCount: number;
    conversionRate: number;
    potentialRevenue: number;
    scholarshipRequests: number;
    overdueTasks: number;
}

// ============================================================
// SALES SERVICE - API CALLS
// ============================================================

const salesService = {
    // ==================== STATS ====================
    getStats: async (): Promise<SalesStats> => {
        const response = await fetch(`${SALES_SERVICE_URL}/stats`);
        if (!response.ok) {
            throw new Error(`Failed to fetch sales stats: ${response.statusText}`);
        }
        return response.json();
    },

    // ==================== LEADS ====================
    getAllLeads: async (status?: string): Promise<Lead[]> => {
        const url = status
            ? `${SALES_SERVICE_URL}/leads?status=${encodeURIComponent(status)}`
            : `${SALES_SERVICE_URL}/leads`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }
        return response.json();
    },

    getLeadById: async (id: number): Promise<Lead> => {
        const response = await fetch(`${SALES_SERVICE_URL}/leads/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch lead: ${response.statusText}`);
        }
        return response.json();
    },

    searchLeads: async (searchTerm: string): Promise<Lead[]> => {
        const response = await fetch(
            `${SALES_SERVICE_URL}/leads/search?term=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
            throw new Error(`Failed to search leads: ${response.statusText}`);
        }
        return response.json();
    },

    getLeadsByPriority: async (priority: string): Promise<Lead[]> => {
        const response = await fetch(`${SALES_SERVICE_URL}/leads/priority/${priority}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch leads by priority: ${response.statusText}`);
        }
        return response.json();
    },

    createLead: async (lead: Lead): Promise<Lead> => {
        const response = await fetch(`${SALES_SERVICE_URL}/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lead),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to create lead: ${response.statusText}`);
        }
        return response.json();
    },

    updateLead: async (id: number, lead: Lead): Promise<Lead> => {
        const response = await fetch(`${SALES_SERVICE_URL}/leads/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lead),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update lead: ${response.statusText}`);
        }
        return response.json();
    },

    updateLeadStatus: async (id: number, status: string): Promise<Lead> => {
        const response = await fetch(
            `${SALES_SERVICE_URL}/leads/${id}/status`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update lead status: ${response.statusText}`);
        }
        return response.json();
    },

    deleteLead: async (id: number): Promise<void> => {
        const response = await fetch(`${SALES_SERVICE_URL}/leads/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete lead: ${response.statusText}`);
        }
    },

    // ==================== TASKS ====================
    getAllTasks: async (): Promise<Task[]> => {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) {
            throw new Error(`Failed to fetch all tasks: ${response.statusText}`);
        }
        return response.json();
    },

    getLeadTasks: async (leadId: number): Promise<Task[]> => {
        const response = await fetch(`${API_BASE_URL}/tasks/lead/${leadId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
        }
        return response.json();
    },

    createTask: async (task: Task): Promise<Task> => {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to create task: ${response.statusText}`);
        }
        return response.json();
    },

    updateTask: async (taskId: number, task: Partial<Task>): Promise<Task> => {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update task: ${response.statusText}`);
        }
        return response.json();
    },

    deleteTask: async (taskId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.statusText}`);
        }
    },

    // ==================== COMMUNICATIONS ====================
    getLeadCommunications: async (leadId: number): Promise<Communication[]> => {
        const response = await fetch(`${API_BASE_URL}/communications/lead/${leadId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch communications: ${response.statusText}`);
        }
        return response.json();
    },

    getAllCommunications: async (): Promise<Communication[]> => {
        const response = await fetch(`${API_BASE_URL}/communications`);
        if (!response.ok) {
            throw new Error(`Failed to fetch all communications: ${response.statusText}`);
        }
        return response.json();
    },

    createCommunication: async (communication: Communication): Promise<Communication> => {
        const response = await fetch(`${API_BASE_URL}/communications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(communication),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to create communication: ${response.statusText}`);
        }
        return response.json();
    },

    deleteCommunication: async (commId: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/communications/${commId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete communication: ${response.statusText}`);
        }
    },

    // ==================== SALES STAGES ====================
    getAllStages: async (): Promise<SalesStage[]> => {
        const response = await fetch(`${SALES_SERVICE_URL}/stages?includeInactive=true`);
        if (!response.ok) {
            throw new Error(`Failed to fetch stages: ${response.statusText}`);
        }
        return response.json();
    },

    getActiveStages: async (): Promise<SalesStage[]> => {
        const response = await fetch(`${SALES_SERVICE_URL}/stages`);
        if (!response.ok) {
            throw new Error(`Failed to fetch active stages: ${response.statusText}`);
        }
        return response.json();
    },

    createStage: async (stage: SalesStage): Promise<SalesStage> => {
        const response = await fetch(`${SALES_SERVICE_URL}/stages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stage),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to create stage: ${response.statusText}`);
        }
        return response.json();
    },

    updateStage: async (stageId: string, stage: SalesStage): Promise<SalesStage> => {
        const response = await fetch(`${SALES_SERVICE_URL}/stages/${stageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stage),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update stage: ${response.statusText}`);
        }
        return response.json();
    },

    deleteStage: async (stageId: string, moveToStageId?: string): Promise<void> => {
        const url = moveToStageId
            ? `${SALES_SERVICE_URL}/stages/${stageId}?moveToStageId=${encodeURIComponent(moveToStageId)}`
            : `${SALES_SERVICE_URL}/stages/${stageId}`;
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete stage: ${response.statusText}`);
        }
    },
};

export default salesService;
