import { create } from "zustand";

interface Telemetry {
  lat: number;
  lng: number;
  alt: number;
  velocity: number;
  timestamp: number;
}

interface DashboardState {
  activeSection: string;
  sidebarOpen: boolean;
  liveTelemetry: Telemetry | null;
  systemLogs: any[];
  favorites: any[];
  setActiveSection: (section: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setLiveTelemetry: (telemetry: Telemetry) => void;
  setSystemLogs: (logs: any[]) => void;
  addSystemLog: (log: any) => void;
  setFavorites: (favorites: any[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeSection: "Dashboard",
  sidebarOpen: false,
  liveTelemetry: null,
  systemLogs: [],
  favorites: [],
  setActiveSection: (section) => set({ activeSection: section }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setLiveTelemetry: (telemetry) => set({ liveTelemetry: telemetry }),
  setSystemLogs: (logs) => set({ systemLogs: logs }),
  addSystemLog: (log) => set((state) => ({ systemLogs: [log, ...state.systemLogs].slice(0, 50) })),
  setFavorites: (favorites) => set({ favorites }),
}));
export type { Telemetry };
export default useDashboardStore;
