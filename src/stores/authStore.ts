import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await authApi.login(email, password);
          
          // Mock response for now
          const mockUser: User = {
            id: '1',
            name: '사용자',
            email: email,
            role: 'user',
            isVerified: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          
          const mockToken = 'mock-jwt-token';
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          // Store token in localStorage for API requests
          localStorage.setItem('authToken', mockToken);
          
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || '로그인에 실패했습니다.',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        
        // Remove token from localStorage
        localStorage.removeItem('authToken');
      },

      register: async (userData: { name: string; email: string; password: string }) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await authApi.register(userData);
          
          // Mock response for now
          const mockUser: User = {
            id: '1',
            name: userData.name,
            email: userData.email,
            role: 'user',
            isVerified: false,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          
          set({
            user: mockUser,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || '회원가입에 실패했습니다.',
          });
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await authApi.updateProfile(userData);
          
          const updatedUser = { ...user, ...userData };
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
          
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '프로필 업데이트에 실패했습니다.',
          });
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
        localStorage.setItem('authToken', token);
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
