// Use relative URLs - Vite proxy will handle routing to Gateway
const STUDENT_SERVICE_URL = '/api/student';

export interface Student {
    id?: number;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    enrollmentDate?: string;
    program: string;
    currentSemester?: number;
    gpa?: number;
    attendancePercentage?: number;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED';
    feeStatus: 'PAID' | 'PENDING' | 'OVERDUE';
    lastPaymentDate?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface StudentStats {
    totalStudents: number;
    activeStudents: number;
    newEnrollments: number;
    graduatedStudents: number;
    averageGrade: number;
}

const studentService = {
    // Get all students
    getAllStudents: async (): Promise<Student[]> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students`);
        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.statusText}`);
        }
        return response.json();
    },

    // Get student by ID
    getStudentById: async (id: number): Promise<Student> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch student: ${response.statusText}`);
        }
        return response.json();
    },

    // Get student by student ID
    getStudentByStudentId: async (studentId: string): Promise<Student> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students/by-student-id/${studentId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch student: ${response.statusText}`);
        }
        return response.json();
    },

    // Get students by status
    getStudentsByStatus: async (status: Student['status']): Promise<Student[]> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students/status/${status}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.statusText}`);
        }
        return response.json();
    },

    // Get students by program
    getStudentsByProgram: async (program: string): Promise<Student[]> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students/program/${encodeURIComponent(program)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch students: ${response.statusText}`);
        }
        return response.json();
    },

    // Search students
    searchStudents: async (query: string): Promise<Student[]> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Failed to search students: ${response.statusText}`);
        }
        return response.json();
    },

    // Create student
    createStudent: async (student: Student): Promise<Student> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Failed to create student: ${response.statusText}`);
        }
        return response.json();
    },

    // Update student
    updateStudent: async (id: number, student: Student): Promise<Student> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Failed to update student: ${response.statusText}`);
        }
        return response.json();
    },

    // Delete student
    deleteStudent: async (id: number): Promise<void> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/students/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete student: ${response.statusText}`);
        }
    },

    // Get student stats
    getStudentStats: async (): Promise<StudentStats> => {
        const response = await fetch(`${STUDENT_SERVICE_URL}/stats`);
        if (!response.ok) {
            throw new Error(`Failed to fetch student stats: ${response.statusText}`);
        }
        return response.json();
    },
};

export default studentService;

