import { useAppStore } from "./app-store";

/**
 * Authentication state
 */
export const useIsAuthenticated = () =>
  useAppStore((state) => state.isAuthenticated);

/**
 * Vehicle onboarding state
 */
export const useHasVehicle = () => useAppStore((state) => state.hasVehicle);

/**
 * Store actions
 */
export const useSetAuthenticated = () =>
  useAppStore((state) => state.setAuthenticated);

export const useSetHasVehicle = () =>
  useAppStore((state) => state.setHasVehicle);
