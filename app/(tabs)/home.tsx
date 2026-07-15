// ─── app/(tabs)/home.tsx — Dashboard with Pull-to-Refresh ────────────────────
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AlertCard from "../../components/AlertCard";
import { Colors, Font, Radius, Spacing } from "../../constants/theme";
import {
  formatKES,
  getReminderStatus,
  useGlobal,
} from "../../context/GlobalState";
import {
  fetchUpcomingServiceTemplates,
  ServiceTemplate,
} from "../../services/api";

export default function HomeScreen() {
  const router = useRouter();
  const { userVehicle, totalSpent, nextServiceKm, reminders, refreshRecords } =
    useGlobal();

  const [refreshing, setRefreshing] = useState(false);
  const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  // Fetch service templates from API
  async function loadTemplates() {
    const result = await fetchUpcomingServiceTemplates();
    if (result.success && result.data) {
      setTemplates(result.data);
      setNetworkError(null);
      setLastSynced(new Date().toLocaleTimeString());
    } else {
      setNetworkError(result.error);
    }
  }

  // Load on first focus
  useFocusEffect(
    useCallback(() => {
      refreshRecords();
      loadTemplates();
    }, []),
  );

  // Pull-to-refresh handler
  async function onRefresh() {
    setRefreshing(true);
    refreshRecords();
    await loadTemplates();
    setRefreshing(false);
  }

  // Build reminder cards
  const reminderData = useMemo(() => {
    return reminders
      .map((r) => {
        const nextAtKm = r.lastServiceMileage + r.intervalKm;
        const currentMileage = userVehicle?.currentMileage ?? 0;
        const remainingKm = Math.max(0, nextAtKm - currentMileage);
        const status = getReminderStatus(remainingKm);
        return { ...r, nextAtKm, remainingKm, status };
      })
      .sort((a, b) => a.remainingKm - b.remainingKm);
  }, [reminders, userVehicle?.currentMileage]);

  const vehicleLabel = userVehicle
    ? `${userVehicle.vehicleName} | ${userVehicle.currentMileage.toLocaleString()} km`
    : "No vehicle set up";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* ── Top Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerTop}>
            <View>
              <Text style={styles.bannerTitle}>MileWise</Text>
              <Text style={styles.bannerSub}>{vehicleLabel}</Text>
              {lastSynced && (
                <Text style={styles.syncedText}>🟢 Synced at {lastSynced}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => router.push("/vehicle-profile")}
            >
              <Text style={styles.profileEmoji}>🚗</Text>
            </TouchableOpacity>
          </View>

          {/* ── Metric Cards ── */}
          <View style={styles.metricRow}>
            <View
              style={[styles.metricCard, { borderTopColor: Colors.accent }]}
            >
              <Text style={styles.metricLabel}>Total Spent</Text>
              <Text style={styles.metricValue}>{formatKES(totalSpent)}</Text>
              <Text style={styles.metricNote}>All time</Text>
            </View>
            <View style={[styles.metricCard, { borderTopColor: Colors.soon }]}>
              <Text style={styles.metricLabel}>Next Service</Text>
              <Text style={[styles.metricValue, { color: Colors.soon }]}>
                {nextServiceKm.toLocaleString()} km
              </Text>
              <Text style={styles.metricNote}>Oil Change</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* ── Network Error Banner ── */}
          {networkError && (
            <View style={styles.netErrorBanner}>
              <Text style={styles.netErrorIcon}>📡</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.netErrorTitle}>Server Unreachable</Text>
                <Text style={styles.netErrorMsg}>{networkError}</Text>
                <Text style={styles.netErrorHint}>Pull down to retry</Text>
              </View>
              <TouchableOpacity onPress={() => setNetworkError(null)}>
                <Text style={styles.netErrorClose}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Quick Actions ── */}
          <View style={styles.quickActions}>
            {[
              { icon: "➕", label: "Log Service", route: "/(tabs)/add" },
              { icon: "🔔", label: "Reminders", route: "/(tabs)/alerts" },
              { icon: "📋", label: "History", route: "/(tabs)/history" },
            ].map(({ icon, label, route }) => (
              <TouchableOpacity
                key={label}
                style={styles.quickBtn}
                onPress={() => router.push(route as any)}
              >
                <Text style={styles.quickBtnIcon}>{icon}</Text>
                <Text style={styles.quickBtnLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Upcoming Reminders ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/alerts")}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          {reminderData.slice(0, 3).map((r) => (
            <AlertCard
              key={r.id}
              icon={r.icon}
              name={r.name}
              remainingKm={r.remainingKm}
              nextAtKm={r.nextAtKm}
              estimatedCost={r.estimatedCost}
              status={r.status}
            />
          ))}

          {/* ── Server Templates Section ── */}
          {templates.length > 0 && (
            <View style={styles.templatesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📡 Server Templates</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.templatesNote}>
                Standard maintenance intervals fetched from server
              </Text>
              {templates.map((t) => (
                <View key={t.id} style={styles.templateCard}>
                  <View style={styles.templateLeft}>
                    <Text style={styles.templateName}>{t.serviceType}</Text>
                    <Text style={styles.templateDesc}>{t.description}</Text>
                    <Text style={styles.templateInterval}>
                      Every {t.intervalKm.toLocaleString()} km
                    </Text>
                  </View>
                  <Text style={styles.templateCost}>
                    {formatKES(t.estimatedCost)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Pull to refresh hint */}
          <Text style={styles.refreshHint}>↕ Pull down to refresh & sync</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  banner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl + 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  bannerTitle: { ...Font.extraBold, fontSize: 24, color: Colors.white },
  bannerSub: { ...Font.regular, fontSize: 13, color: "#90CAF9", marginTop: 2 },
  syncedText: { ...Font.regular, fontSize: 11, color: "#81C784", marginTop: 3 },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF20",
    alignItems: "center",
    justifyContent: "center",
  },
  profileEmoji: { fontSize: 22 },
  metricRow: { flexDirection: "row", gap: Spacing.md },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF15",
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderTopWidth: 3,
  },
  metricLabel: {
    ...Font.medium,
    fontSize: 12,
    color: "#90CAF9",
    marginBottom: 4,
  },
  metricValue: { ...Font.bold, fontSize: 18, color: Colors.white },
  metricNote: {
    ...Font.regular,
    fontSize: 11,
    color: "#FFFFFF66",
    marginTop: 2,
  },
  body: { padding: Spacing.lg },

  // Network error banner
  netErrorBanner: {
    backgroundColor: "#FFF8E1",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "#FFE082",
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  netErrorIcon: { fontSize: 22 },
  netErrorTitle: { ...Font.bold, fontSize: 13, color: "#E65100" },
  netErrorMsg: {
    ...Font.regular,
    fontSize: 12,
    color: "#BF360C",
    marginTop: 2,
    lineHeight: 17,
  },
  netErrorHint: {
    ...Font.medium,
    fontSize: 11,
    color: "#FF8F00",
    marginTop: 4,
  },
  netErrorClose: { fontSize: 16, color: "#E65100" },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    alignItems: "center",
    paddingVertical: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickBtnIcon: { fontSize: 22, marginBottom: 4 },
  quickBtnLabel: { ...Font.medium, fontSize: 12, color: Colors.textMid },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: { ...Font.bold, fontSize: 17, color: Colors.textDark },
  seeAll: { ...Font.medium, fontSize: 13, color: Colors.primary },
  liveBadge: {
    backgroundColor: Colors.ok,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  liveBadgeText: {
    ...Font.bold,
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  templatesSection: { marginTop: Spacing.lg },
  templatesNote: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  templateCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  templateLeft: { flex: 1 },
  templateName: { ...Font.bold, fontSize: 14, color: Colors.textDark },
  templateDesc: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textMid,
    marginTop: 2,
  },
  templateInterval: {
    ...Font.medium,
    fontSize: 11,
    color: Colors.primary,
    marginTop: 4,
  },
  templateCost: {
    ...Font.bold,
    fontSize: 13,
    color: Colors.accent,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  refreshHint: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
