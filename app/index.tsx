// Temporary routing logic.
//
// Authentication and onboarding state are currently simulated using Zustand.
// Once Supabase authentication and Secure Store persistence are implemented,
// this file will redirect based on the persisted user session.
import { useHasVehicle, useIsAuthenticated } from "@/state/selectors";
import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = useIsAuthenticated();
  const hasVehicle = useHasVehicle();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!hasVehicle) {
    return <Redirect href="/(onboarding)/vehicle-setup" />;
  }

  return <Redirect href="/(tabs)" />;
}
