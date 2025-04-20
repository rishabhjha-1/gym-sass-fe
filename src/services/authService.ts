import BaseService from './baseService';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  gymId: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.post<AuthResponse>('/login', credentials);
  }

  async register(userData: LoginCredentials & { name: string }): Promise<AuthResponse> {
    return this.post<AuthResponse>('/register', userData);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    return this.get<AuthResponse['user']>('/me');
  }
}

// Export a singleton instance
export default new AuthService(); 