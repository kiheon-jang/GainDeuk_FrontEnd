import { create } from 'zustand';
import { Signal, SignalFilters } from '../types';

interface SignalsState {
  signals: Signal[];
  topSignals: Signal[];
  filters: SignalFilters;
  selectedSignal: Signal | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SignalsActions {
  // Data management
  setSignals: (signals: Signal[]) => void;
  addSignal: (signal: Signal) => void;
  updateSignal: (signalId: string, updates: Partial<Signal>) => void;
  removeSignal: (signalId: string) => void;
  setTopSignals: (signals: Signal[]) => void;
  setSelectedSignal: (signal: Signal | null) => void;
  
  // Filters
  setFilters: (filters: Partial<SignalFilters>) => void;
  clearFilters: () => void;
  
  // Pagination
  setPagination: (pagination: Partial<SignalsState['pagination']>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (timestamp: string) => void;
  
  // Utility actions
  getSignalById: (signalId: string) => Signal | undefined;
  getSignalsByTimeframe: (timeframe: string) => Signal[];
  getSignalsByAction: (action: string) => Signal[];
  getStrongSignals: (minScore?: number) => Signal[];
  clearAll: () => void;
}

type SignalsStore = SignalsState & SignalsActions;

const initialFilters: SignalFilters = {
  minScore: undefined,
  maxScore: undefined,
  action: undefined,
  timeframe: undefined,
  priority: undefined,
  coinSymbol: undefined,
};

const initialPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

export const useSignalsStore = create<SignalsStore>((set, get) => ({
  // Initial state
  signals: [],
  topSignals: [],
  filters: initialFilters,
  selectedSignal: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  pagination: initialPagination,

  // Data management actions
  setSignals: (signals: Signal[]) => {
    set({ signals, lastUpdated: new Date().toISOString() });
  },

  addSignal: (signal: Signal) => {
    set((state) => ({
      signals: [signal, ...state.signals],
      lastUpdated: new Date().toISOString(),
    }));
  },

  updateSignal: (signalId: string, updates: Partial<Signal>) => {
    set((state) => ({
      signals: state.signals.map(signal =>
        signal._id === signalId ? { ...signal, ...updates } : signal
      ),
      topSignals: state.topSignals.map(signal =>
        signal._id === signalId ? { ...signal, ...updates } : signal
      ),
      selectedSignal: state.selectedSignal?._id === signalId
        ? { ...state.selectedSignal, ...updates }
        : state.selectedSignal,
      lastUpdated: new Date().toISOString(),
    }));
  },

  removeSignal: (signalId: string) => {
    set((state) => ({
      signals: state.signals.filter(signal => signal._id !== signalId),
      topSignals: state.topSignals.filter(signal => signal._id !== signalId),
      selectedSignal: state.selectedSignal?._id === signalId ? null : state.selectedSignal,
      lastUpdated: new Date().toISOString(),
    }));
  },

  setTopSignals: (signals: Signal[]) => {
    set({ topSignals: signals, lastUpdated: new Date().toISOString() });
  },

  setSelectedSignal: (signal: Signal | null) => {
    set({ selectedSignal: signal });
  },

  // Filter actions
  setFilters: (newFilters: Partial<SignalFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
    }));
  },

  clearFilters: () => {
    set({ filters: initialFilters, pagination: { ...get().pagination, page: 1 } });
  },

  // Pagination actions
  setPagination: (newPagination: Partial<SignalsState['pagination']>) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    }));
  },

  setPage: (page: number) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
  },

  setLimit: (limit: number) => {
    set((state) => ({
      pagination: { ...state.pagination, limit, page: 1 }, // Reset to first page when limit changes
    }));
  },

  // Loading and error actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLastUpdated: (timestamp: string) => {
    set({ lastUpdated: timestamp });
  },

  // Utility actions
  getSignalById: (signalId: string) => {
    const { signals } = get();
    return signals.find(signal => signal._id === signalId);
  },

  getSignalsByTimeframe: (timeframe: string) => {
    const { signals } = get();
    return signals.filter(signal => signal.timeframe === timeframe);
  },

  getSignalsByAction: (action: string) => {
    const { signals } = get();
    return signals.filter(signal => signal.recommendation.action === action);
  },

  getStrongSignals: (minScore: number = 80) => {
    const { signals } = get();
    return signals.filter(signal => signal.finalScore >= minScore);
  },

  clearAll: () => {
    set({
      signals: [],
      topSignals: [],
      selectedSignal: null,
      filters: initialFilters,
      pagination: initialPagination,
      isLoading: false,
      error: null,
      lastUpdated: null,
    });
  },
}));
