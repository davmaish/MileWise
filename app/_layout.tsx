// ─── app/_layout.tsx — Root Layout ───────────────────────────────────────────
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../constants/theme";
import { GlobalProvider } from "../context/GlobalState";
import { initDatabase } from "../database/db";

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Initialize database FIRST, then let screens load
    initDatabase();
    setDbReady(true);
  }, []);

  // Show loading spinner until DB is ready
  if (!dbReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <GlobalProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="vehicle-profile" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GlobalProvider>
  );
}
