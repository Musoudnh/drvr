import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, RoleType } from '../types';
import { departmentService } from '../services/departmentService';

interface AuthContextType {
  user: User | null;
  userRoles: UserRole[];
  primaryRole: RoleType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (roleType: RoleType) => boolean;
  canApprove: (budget: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '00000000-0000-0000-0000-000000000001',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'company',
    company: 'Acme Corp'
  });
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [primaryRole, setPrimaryRole] = useState<RoleType | null>('Department Manager');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadUserRoles(user.id);
    }
  }, [user?.id]);

  const loadUserRoles = async (userId: string) => {
    try {
      const roles = await departmentService.getUserRoles(userId);
      setUserRoles(roles);
      if (roles.length > 0) {
        setPrimaryRole(roles[0].role_type);
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
      setUserRoles([]);
    }
  };

  const hasRole = (roleType: RoleType): boolean => {
    return userRoles.some(role => role.role_type === roleType);
  };

  const canApprove = (budget: number): boolean => {
    return userRoles.some(
      role => role.can_approve_projects && role.spending_authority_limit >= budget
    );
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data based on email domain
    const mockUser: User = {
      id: '00000000-0000-0000-0000-000000000001',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'company',
      company: 'Acme Corp'
    };

    setUser(mockUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRoles, primaryRole, login, logout, isLoading, hasRole, canApprove }}>
      {children}
    </AuthContext.Provider>
  );
};