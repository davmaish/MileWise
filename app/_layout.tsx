// ─── app/_layout.tsx — Root Layout with Splash Screen & Notifications ─────────
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors, Font } from "../constants/theme";
import { GlobalProvider } from "../context/GlobalState";
import { initDatabase } from "../database/db";
import { requestNotificationPermission } from "../services/notifications";

function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Text style={styles.splashIcon}>🚗</Text>
      <Text style={styles.splashTitle}>MileWise</Text>
      <Text style={styles.splashSub}>Track. Remind. Budget.</Text>
      <ActivityIndicator
        size="small"
        color={Colors.accent}
        style={styles.splashLoader}
      />
    </View>
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      // Step 1: Initialize SQLite database
      initDatabase();

      // Step 2: Request notification permission
      await requestNotificationPermission();

      // Step 3: Small delay to show splash
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setDbReady(true);
    }
    initialize();
  }, []);

  if (!dbReady) return <SplashScreen />;

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

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  splashIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  splashTitle: {
    ...Font.extraBold,
    fontSize: 48,
    color: Colors.white,
    letterSpacing: 2,
  },
  splashSub: {
    ...Font.medium,
    fontSize: 16,
    color: Colors.accent,
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 40,
  },
  splashLoader: {
    marginTop: 20,
  },
});
