import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '../types';
import { useErrorLogger } from '../hooks/useErrorLogger';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding authentication headers
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Get token from localStorage or state management
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced error logging function
const logApiError = (error: AxiosError, context: string) => {
  const { response, request, message, config } = error;
  
  const errorDetails = {
    url: config?.url,
    method: config?.method,
    status: response?.status,
    statusText: response?.statusText,
    responseData: response?.data,
    requestData: config?.data,
    headers: config?.headers
  };

  if (response) {
    // Server responded with error status
    const { status, data } = response;
    
    switch (status) {
      case 401:
        console.error('Unauthorized: Authentication required');
        break;
      case 403:
        console.error('Forbidden: Access denied');
        break;
      case 404:
        console.error('Not Found: Resource not found');
        break;
      case 429:
        console.error('Too Many Requests: Rate limit exceeded');
        break;
      case 500:
        console.error('Internal Server Error');
        break;
      default:
        console.error(`API Error ${status}:`, data);
    }
  } else if (request) {
    console.error('Network Error: No response received');
  } else {
    console.error('Request Error:', message);
  }

  // Log to error tracking service
  console.group(`🚨 API Error - ${context}`);
  console.error('Error:', error);
  console.error('Details:', errorDetails);
  console.groupEnd();
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time for debugging
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(`API Request to ${response.config.url} took ${duration}ms`);
    }

    return response;
  },
  (error: AxiosError) => {
    const { response, request, message, config } = error;

    // Log the error with context
    logApiError(error, 'API Response Interceptor');

    // Handle different error types
    if (response) {
      // Server responded with error status
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show access denied message
          break;
        case 404:
          // Not Found - show not found message
          break;
        case 429:
          // Rate limited - show rate limit message
          break;
        case 500:
          // Server error - show server error message
          break;
        default:
          // Other server errors
          break;
      }

      return Promise.reject({
        status,
        message: data?.message || `HTTP Error ${status}`,
        data: data,
        url: config?.url,
        method: config?.method
      });
    } else if (request) {
      // Request was made but no response received
      return Promise.reject({
        status: 0,
        message: 'Network Error: Please check your connection',
        type: 'NETWORK_ERROR',
        url: config?.url,
        method: config?.method
      });
    } else {
      // Something else happened
      return Promise.reject({
        status: 0,
        message: message || 'An unexpected error occurred',
        type: 'REQUEST_ERROR',
        url: config?.url,
        method: config?.method
      });
    }
  }
);

// Generic API methods
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
};

// Retry logic for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry for certain error types
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        throw error;
      }

      if (attempt < maxRetries) {
        console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
};

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default apiClient;
