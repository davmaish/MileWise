// ─── app/(tabs)/performance.tsx — Performance Metrics ────────────────────────
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Font, Radius, Spacing } from "../../constants/theme";
import { formatKES, useGlobal } from "../../context/GlobalState";
import { getAllFuelLogs, getAllRecords } from "../../database/db";

export default function PerformanceScreen() {
  const { maintenanceRecords, fuelLogs, totalSpent, totalFuelSpent } =
    useGlobal();
  const [queryTime, setQueryTime] = useState<number | null>(null);
  const [recordCount, setRecordCount] = useState(0);
  const [fuelCount, setFuelCount] = useState(0);

  useEffect(() => {
    measureQueryPerformance();
  }, []);

  function measureQueryPerformance() {
    // Measure how fast the database query runs
    const start = Date.now();
    const records = getAllRecords();
    const fuels = getAllFuelLogs();
    const end = Date.now();

    setQueryTime(end - start);
    setRecordCount(records.length);
    setFuelCount(fuels.length);
  }

  const metrics = [
    {
      label: "DB Query Time",
      value: `${queryTime ?? 0}ms`,
      icon: "⚡",
      color: Colors.ok,
      note: "Target: <100ms",
    },
    {
      label: "Maintenance Records",
      value: String(recordCount),
      icon: "🔧",
      color: Colors.primary,
      note: "Total in SQLite",
    },
    {
      label: "Fuel Log Records",
      value: String(fuelCount),
      icon: "⛽",
      color: Colors.accent,
      note: "Total in SQLite",
    },
    {
      label: "Total Maintenance",
      value: formatKES(totalSpent),
      icon: "💰",
      color: Colors.soon,
      note: "All time spend",
    },
    {
      label: "Total Fuel Spend",
      value: formatKES(totalFuelSpent),
      icon: "⛽",
      color: Colors.urgent,
      note: "All time spend",
    },
    {
      label: "Image Compression",
      value: "50%",
      icon: "📷",
      color: Colors.ok,
      note: "Quality setting",
    },
    {
      label: "List Batch Size",
      value: "10 items",
      icon: "📋",
      color: Colors.primary,
      note: "Max per render",
    },
    {
      label: "DB Indexes",
      value: "5 active",
      icon: "🗄️",
      color: Colors.ok,
      note: "Query optimization",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⚡ Performance</Text>
          <Text style={styles.headerSub}>App optimization metrics</Text>
        </View>

        <View style={styles.body}>
          {/* Query Speed Banner */}
          <View
            style={[
              styles.speedBanner,
              {
                backgroundColor: (queryTime ?? 0) < 100 ? "#EFFAF3" : "#FFF8E1",
              },
            ]}
          >
            <Text style={styles.speedIcon}>
              {(queryTime ?? 0) < 100 ? "✅" : "⚠️"}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.speedTitle}>
                Database Query: {queryTime ?? 0}ms
              </Text>
              <Text style={styles.speedDesc}>
                {(queryTime ?? 0) < 100
                  ? "Excellent — queries are fast and optimized"
                  : "Consider adding more indexes"}
              </Text>
            </View>
          </View>

          {/* Metrics Grid */}
          <Text style={styles.sectionLabel}>Optimization Metrics</Text>
          <View style={styles.metricsGrid}>
            {metrics.map((m, i) => (
              <View
                key={i}
                style={[styles.metricCard, { borderTopColor: m.color }]}
              >
                <Text style={styles.metricIcon}>{m.icon}</Text>
                <Text style={styles.metricValue}>{m.value}</Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={styles.metricNote}>{m.note}</Text>
              </View>
            ))}
          </View>

          {/* Optimizations Applied */}
          <Text style={styles.sectionLabel}>Optimizations Applied</Text>
          {[
            {
              icon: "🗄️",
              title: "Database Indexing",
              desc: "Added 5 indexes on frequently queried columns (vehicle_id, date, serviceType) reducing search time.",
            },
            {
              icon: "🧠",
              title: "Memoization (useMemo)",
              desc: "Dashboard reminder calculations are memoized — only recalculate when vehicle mileage changes.",
            },
            {
              icon: "📋",
              title: "FlatList Optimization",
              desc: "removeClippedSubviews, maxToRenderPerBatch=10 and windowSize=5 reduce memory usage on long lists.",
            },
            {
              icon: "📷",
              title: "Image Compression",
              desc: "Camera quality reduced from 80% to 50% — cuts photo file size in half while maintaining clarity.",
            },
            {
              icon: "🌐",
              title: "Async Networking",
              desc: "All API calls use async/await preventing UI thread blocking during network requests.",
            },
            {
              icon: "💾",
              title: "Offline-First Storage",
              desc: "SQLite handles all data locally — no network dependency for core functionality.",
            },
          ].map((opt, i) => (
            <View key={i} style={styles.optCard}>
              <Text style={styles.optIcon}>{opt.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.optTitle}>{opt.title}</Text>
                <Text style={styles.optDesc}>{opt.desc}</Text>
              </View>
            </View>
          ))}

          {/* Re-measure button */}
          <TouchableOpacity
            style={styles.measureBtn}
            onPress={measureQueryPerformance}
          >
            <Text style={styles.measureBtnText}>🔄 Re-measure Performance</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { ...Font.bold, fontSize: 22, color: Colors.white },
  headerSub: { ...Font.regular, fontSize: 13, color: "#90CAF9", marginTop: 2 },
  body: { padding: Spacing.lg },
  speedBanner: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  speedIcon: { fontSize: 24 },
  speedTitle: { ...Font.bold, fontSize: 14, color: Colors.textDark },
  speedDesc: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textMid,
    marginTop: 2,
  },
  sectionLabel: {
    ...Font.semiBold,
    fontSize: 14,
    color: Colors.textMid,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    width: "47%",
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIcon: { fontSize: 24, marginBottom: 4 },
  metricValue: {
    ...Font.bold,
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 2,
  },
  metricLabel: {
    ...Font.semiBold,
    fontSize: 11,
    color: Colors.textMid,
    textAlign: "center",
  },
  metricNote: {
    ...Font.regular,
    fontSize: 10,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 2,
  },
  optCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  optIcon: { fontSize: 22 },
  optTitle: {
    ...Font.bold,
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 3,
  },
  optDesc: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textMid,
    lineHeight: 18,
  },
  measureBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  measureBtnText: { ...Font.bold, fontSize: 15, color: Colors.white },
});
