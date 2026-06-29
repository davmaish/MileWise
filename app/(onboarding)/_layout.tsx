import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="vehicle-setup" options={{ headerShown: false }} />
    </Stack>
  );
}
