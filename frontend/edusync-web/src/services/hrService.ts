// hrService.ts - HR API Service
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'; // Gateway URL

// Types matching backend
export interface Department {
  id?: number;
  name: string;
  code?: string;
  description?: string;
  headOfDepartmentId?: number | null;
  parentDepartmentId?: number | null;
  budget?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id?: number;
  userId?: number | null;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  hireDate: string;
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  position: string;
  departmentId?: number | null;
  salary?: number;
  status?: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'SUSPENDED';
  terminationDate?: string;
  createdAt?: string;
  updatedAt?: string;
  fullName?: string;
}

export interface HRStats {
  totalStaff: number;
  activeStaff: number;
  newHires: number;
  departments: number;
  averageSalary: number;
  pendingLeaveRequests?: number;
  pendingPayrolls?: number;
}

class HRService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_URL}/api/hr/health`);
    if (!response.ok) throw new Error('HR Service is down');
    return response.json();
  }

  // Stats
  async getStats(): Promise<HRStats> {
    const response = await fetch(`${API_URL}/api/hr/stats`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch HR stats');
    return response.json();
  }

  // Departments
  async getAllDepartments(): Promise<Department[]> {
    const response = await fetch(`${API_URL}/api/hr/departments`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
  }

  async getActiveDepartments(): Promise<Department[]> {
    const response = await fetch(`${API_URL}/api/hr/departments/active`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active departments');
    return response.json();
  }

  async getDepartmentById(id: number): Promise<Department> {
    const response = await fetch(`${API_URL}/api/hr/departments/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch department');
    return response.json();
  }

  async createDepartment(department: Department): Promise<Department> {
    const response = await fetch(`${API_URL}/api/hr/departments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(department),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create department');
    }
    return response.json();
  }

  async updateDepartment(id: number, department: Department): Promise<Department> {
    const response = await fetch(`${API_URL}/api/hr/departments/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(department),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update department');
    }
    return response.json();
  }

  async deleteDepartment(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/hr/departments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete department');
  }

  // Staff
  async getAllStaff(): Promise<Staff[]> {
    const response = await fetch(`${API_URL}/api/hr/staff`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch staff');
    return response.json();
  }

  async getActiveStaff(): Promise<Staff[]> {
    const response = await fetch(`${API_URL}/api/hr/staff/active`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch active staff');
    return response.json();
  }

  async getStaffById(id: number): Promise<Staff> {
    const response = await fetch(`${API_URL}/api/hr/staff/${id}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch staff member');
    return response.json();
  }

  async getStaffByEmployeeId(employeeId: string): Promise<Staff> {
    const response = await fetch(`${API_URL}/api/hr/staff/employee/${employeeId}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch staff member');
    return response.json();
  }

  async getStaffByEmail(email: string): Promise<Staff> {
    const response = await fetch(`${API_URL}/api/hr/staff/email/${encodeURIComponent(email)}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch staff member');
    return response.json();
  }

  async getStaffByDepartment(departmentId: number): Promise<Staff[]> {
    const response = await fetch(`${API_URL}/api/hr/staff/department/${departmentId}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch department staff');
    return response.json();
  }

  async createStaff(staff: Staff): Promise<Staff> {
    const response = await fetch(`${API_URL}/api/hr/staff`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(staff),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create staff member');
    }
    return response.json();
  }

  async updateStaff(id: number, staff: Staff): Promise<Staff> {
    const response = await fetch(`${API_URL}/api/hr/staff/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(staff),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update staff member');
    }
    return response.json();
  }

  async terminateStaff(id: number): Promise<Staff> {
    const response = await fetch(`${API_URL}/api/hr/staff/${id}/terminate`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to terminate staff member');
    return response.json();
  }

  async deleteStaff(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/hr/staff/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete staff member');
  }
}

// Export singleton instance
export const hrService = new HRService();
export default hrService;

