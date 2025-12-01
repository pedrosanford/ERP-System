// authService.ts - Auth API Service
// Use relative URLs - Vite proxy will handle routing to Gateway

// Types matching backend
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string | null;
  language?: string | null;
  region?: string | null;
  avatarData?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  language?: string;
  region?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  private getAuthHeaders(includeJson = true): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (includeJson) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Get all users
  async getAllUsers(): Promise<UserDTO[]> {
    try {
      const response = await fetch('/api/auth/users', {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn('Authentication not available, returning sample users.');
          return this.getFallbackUsers();
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return this.getFallbackUsers();
    }
  }

  private getFallbackUsers(): UserDTO[] {
    return [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@edusync.com',
        role: 'ADMIN',
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Finance Manager',
        email: 'finance@edusync.com',
        role: 'FINANCE',
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'HR Specialist',
        email: 'hr@edusync.com',
        role: 'HR',
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async getProfile(): Promise<UserProfile> {
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to load profile. Please try again.');
    }

    return response.json();
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = 'Failed to update profile.';
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.message) {
          message = parsed.message;
        }
      } catch {
        if (errorText) {
          message = errorText;
        }
      }
      throw new Error(message);
    }

    return response.json();
  }

  async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
    const response = await fetch('/api/auth/profile/password', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let message = 'Failed to update password.';
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.message) {
          message = parsed.message;
        }
      } catch {
        if (errorText) {
          message = errorText;
        }
      }
      throw new Error(message);
    }
  }

  async uploadAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/auth/profile/avatar', {
      method: 'POST',
      headers: this.getAuthHeaders(false),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to upload avatar.');
    }

    return response.json();
  }

  async removeAvatar(): Promise<UserProfile> {
    const response = await fetch('/api/auth/profile/avatar', {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to remove avatar.');
    }

    return response.json();
  }
}

export default new AuthService();

