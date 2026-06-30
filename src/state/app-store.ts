import { create } from "zustand";

interface AppState {
  isAuthenticated: boolean;
  hasVehicle: boolean;
  setAuthenticated: (value: boolean) => void;
  setHasVehicle: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: true,
  hasVehicle: true,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setHasVehicle: (value: boolean) => set({ hasVehicle: value }),
}));
