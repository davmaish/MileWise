// ─── app/index.tsx — Welcome Screen ──────────────────────────────────────────
import { useRouter } from "expo-router";
import React from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import { Colors, Font, Radius, Spacing } from "../constants/theme";
import { getVehicle } from "../database/db";

export default function WelcomeScreen() {
  const router = useRouter();

  function handleGetStarted() {
    router.push("/vehicle-profile");
  }

  function handleLogin() {
    // Validate there is a vehicle already saved
    try {
      const existing = getVehicle();
      if (existing) {
        router.replace("/(tabs)/home");
      } else {
        Alert.alert(
          "No Account Found",
          'No vehicle profile found. Please tap "Get Started" to set up your vehicle first.',
          [{ text: "OK" }],
        );
      }
    } catch {
      Alert.alert(
        "Login Failed",
        'Something went wrong. Please tap "Get Started" instead.',
        [{ text: "OK" }],
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* ── Top Section ── */}
        <View style={styles.topSection}>
          {/* Logo Circle */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🚗</Text>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>MileWise</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Smart Vehicle Maintenance{"\n"}& Expense Management System
          </Text>

          {/* Tagline */}
          <Text style={styles.tagline}>Track. Remind. Budget.</Text>
        </View>

        {/* ── Feature Pills ── */}
        <View style={styles.pillRow}>
          {["🔧 Maintenance", "💰 Expenses", "🔔 Reminders"].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* ── Buttons ── */}
        <View style={styles.buttonSection}>
          <AppButton
            title="Get Started"
            onPress={handleGetStarted}
            backgroundColor={Colors.accent}
            textColor={Colors.textOnAccent}
            style={styles.btn}
          />
          <View style={styles.gap} />
          <AppButton
            title="Login"
            onPress={handleLogin}
            backgroundColor="transparent"
            textColor={Colors.white}
            borderColor={Colors.white}
            style={styles.btn}
          />
        </View>

        {/* ── Bottom note ── */}
        <Text style={styles.footerNote}>
          MileWise — Built for Kenyan drivers 🇰🇪
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  topSection: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 46,
  },
  appName: {
    ...Font.extraBold,
    fontSize: 42,
    color: Colors.white,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Font.medium,
    fontSize: 15,
    color: "#90CAF9",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  tagline: {
    ...Font.bold,
    fontSize: 14,
    color: Colors.accent,
    letterSpacing: 1.5,
    marginTop: Spacing.xs,
  },
  pillRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  pill: {
    backgroundColor: "#FFFFFF18",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: "#FFFFFF30",
  },
  pillText: {
    ...Font.medium,
    fontSize: 13,
    color: Colors.white,
  },
  buttonSection: {
    width: "100%",
    paddingHorizontal: Spacing.sm,
  },
  btn: {
    paddingVertical: 16,
  },
  gap: {
    height: Spacing.md,
  },
  footerNote: {
    ...Font.regular,
    fontSize: 12,
    color: "#FFFFFF55",
  },
});
