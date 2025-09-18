import { api, retryRequest } from './api';
import type { UserProfile, ApiResponse } from '../types';

export interface UserProfileUpdateData {
  investmentStyle?: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
  riskTolerance?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tradingExperience?: number;
  availableTime?: 'minimal' | 'part-time' | 'full-time';
  preferredTimeframes?: string[];
  activeHours?: {
    start: string;
    end: string;
    timezone: string;
  };
  preferredCoins?: string[];
  maxPositionSize?: number;
  notificationSettings?: {
    email: {
      enabled: boolean;
      frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    };
    push: {
      enabled: boolean;
      highPriorityOnly: boolean;
    };
    discord: {
      enabled: boolean;
      webhookUrl: string;
    };
  };
  personalizationSettings?: {
    signalSensitivity: number;
    preferredSignalTypes: string[];
    autoTradingEnabled: boolean;
    maxDailySignals: number;
  };
}

export const userProfilesApi = {
  // Get user profile
  getUserProfile: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    return retryRequest(() => 
      api.get<UserProfile>(`/user-profiles/${userId}`)
    );
  },

  // Update user profile
  updateUserProfile: async (
    userId: string, 
    data: UserProfileUpdateData
  ): Promise<ApiResponse<UserProfile>> => {
    return retryRequest(() => 
      api.put<UserProfile>(`/user-profiles/${userId}`, data)
    );
  },

  // Create user profile
  createUserProfile: async (
    userId: string, 
    data: UserProfileUpdateData
  ): Promise<ApiResponse<UserProfile>> => {
    return retryRequest(() => 
      api.post<UserProfile>(`/user-profiles`, { userId, ...data })
    );
  },

  // Get personalized recommendations
  getPersonalizedRecommendations: async (userId: string): Promise<ApiResponse<{
    suggestedTimeframes: string[];
    suggestedCoins: string[];
    riskLevel: number;
    maxDailySignals: number;
    tradingStrategy: object;
    signalFilters: object;
    positionSizing: object;
    alertSettings: object;
    marketAdaptation: object;
    confidence: number;
    lastUpdated: string;
    profileCompleteness: number;
  }>> => {
    return retryRequest(() => 
      api.get(`/personalization/recommendations/${userId}`)
    );
  },

  // Update learning data
  updateLearningData: async (
    userId: string,
    learningData: {
      successfulTrades?: number;
      totalTrades?: number;
      averageHoldTime?: number;
      preferredStrategies?: string[];
    }
  ): Promise<ApiResponse<UserProfile>> => {
    return retryRequest(() => 
      api.patch<UserProfile>(`/user-profiles/${userId}/learning`, learningData)
    );
  },

  // Get user statistics
  getUserStats: async (userId: string): Promise<ApiResponse<{
    totalSignalsReceived: number;
    signalsActedUpon: number;
    successRate: number;
    averageHoldTime: number;
    preferredTimeframes: string[];
    topPerformingCoins: string[];
    riskAdjustedReturn: number;
    lastActive: string;
  }>> => {
    return retryRequest(() => 
      api.get(`/user-profiles/${userId}/stats`)
    );
  },

  // Update notification settings
  updateNotificationSettings: async (
    userId: string,
    settings: {
      email: {
        enabled: boolean;
        frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
      };
      push: {
        enabled: boolean;
        highPriorityOnly: boolean;
      };
      discord: {
        enabled: boolean;
        webhookUrl: string;
      };
    }
  ): Promise<ApiResponse<UserProfile>> => {
    return retryRequest(() => 
      api.patch<UserProfile>(`/user-profiles/${userId}/notifications`, settings)
    );
  },

  // Update personalization settings
  updatePersonalizationSettings: async (
    userId: string,
    settings: {
      signalSensitivity: number;
      preferredSignalTypes: string[];
      autoTradingEnabled: boolean;
      maxDailySignals: number;
    }
  ): Promise<ApiResponse<UserProfile>> => {
    return retryRequest(() => 
      api.patch<UserProfile>(`/user-profiles/${userId}/personalization`, settings)
    );
  },

  // Get profile completeness
  getProfileCompleteness: async (userId: string): Promise<ApiResponse<{
    completeness: number;
    missingFields: string[];
    recommendations: string[];
  }>> => {
    return retryRequest(() => 
      api.get(`/user-profiles/${userId}/completeness`)
    );
  },

  // Delete user profile
  deleteUserProfile: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    return retryRequest(() => 
      api.delete(`/user-profiles/${userId}`)
    );
  },
};
