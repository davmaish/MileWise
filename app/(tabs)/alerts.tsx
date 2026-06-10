// ─── app/(tabs)/alerts.tsx — Reminders Screen ────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { useGlobal, getReminderStatus, formatKES, ReminderStatus } from '../../context/GlobalState';
import AlertCard from '../../components/AlertCard';
import { Colors, Font, Spacing } from '../../constants/theme';

const STATUS_ORDER: ReminderStatus[] = ['URGENT', 'SOON', 'OK'];

export default function AlertsScreen() {
  const { userVehicle, reminders } = useGlobal();
  const currentMileage = userVehicle?.currentMileage ?? 0;

  // Build full reminder display data with calculated fields
  const reminderData = reminders.map(r => {
    const nextAtKm = r.lastServiceMileage + r.intervalKm;
    const remainingKm = Math.max(0, nextAtKm - currentMileage);
    const status = getReminderStatus(remainingKm);
    return { ...r, nextAtKm, remainingKm, status };
  });

  // Group by status
  const grouped = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = reminderData.filter(r => r.status === status);
    return acc;
  }, {} as Record<ReminderStatus, typeof reminderData>);

  const STATUS_LABELS: Record<ReminderStatus, { label: string; emoji: string; color: string }> = {
    URGENT: { label: 'Action Required', emoji: '🔴', color: Colors.urgent },
    SOON:   { label: 'Coming Soon',     emoji: '🟠', color: Colors.soon   },
    OK:     { label: 'All Good',        emoji: '🟢', color: Colors.ok     },
  };

  // Summary counts
  const urgentCount = grouped.URGENT.length;
  const soonCount = grouped.SOON.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔔 Reminders</Text>
          <Text style={styles.headerSub}>Upcoming service alerts</Text>
          {userVehicle && (
            <Text style={styles.headerMileage}>
              Current mileage: {currentMileage.toLocaleString()} km
            </Text>
          )}
        </View>

        {/* ── Summary Banner ── */}
        {(urgentCount > 0 || soonCount > 0) && (
          <View style={styles.summaryBanner}>
            <Text style={styles.summaryIcon}>⚠️</Text>
            <View style={styles.summaryText}>
              {urgentCount > 0 && (
                <Text style={styles.summaryLine}>
                  <Text style={{ color: Colors.urgent, ...Font.bold }}>{urgentCount} URGENT</Text> service{urgentCount > 1 ? 's' : ''} due now
                </Text>
              )}
              {soonCount > 0 && (
                <Text style={styles.summaryLine}>
                  <Text style={{ color: Colors.soon, ...Font.bold }}>{soonCount}</Text> service{soonCount > 1 ? 's' : ''} coming up soon
                </Text>
              )}
            </View>
          </View>
        )}

        {/* ── Grouped Reminders ── */}
        <View style={styles.body}>
          {STATUS_ORDER.map(status => {
            const items = grouped[status];
            if (items.length === 0) return null;
            const cfg = STATUS_LABELS[status];
            return (
              <View key={status} style={styles.group}>
                {/* Group Header */}
                <View style={styles.groupHeader}>
                  <Text style={styles.groupEmoji}>{cfg.emoji}</Text>
                  <Text style={[styles.groupLabel, { color: cfg.color }]}>{cfg.label}</Text>
                  <View style={[styles.groupCount, { backgroundColor: cfg.color + '20' }]}>
                    <Text style={[styles.groupCountText, { color: cfg.color }]}>{items.length}</Text>
                  </View>
                </View>

                {/* Cards */}
                {items.map(r => (
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
              </View>
            );
          })}

          {/* ── Budget Summary ── */}
          <View style={styles.budgetCard}>
            <Text style={styles.budgetTitle}>💰 Estimated Upcoming Costs</Text>
            {reminderData
              .filter(r => r.status !== 'OK')
              .map(r => (
                <View key={r.id} style={styles.budgetRow}>
                  <Text style={styles.budgetItem}>{r.icon} {r.name}</Text>
                  <Text style={styles.budgetCost}>{formatKES(r.estimatedCost)}</Text>
                </View>
              ))}
            {reminderData.filter(r => r.status !== 'OK').length === 0 && (
              <Text style={styles.budgetAllGood}>All services are up to date 🎉</Text>
            )}
            {reminderData.filter(r => r.status !== 'OK').length > 0 && (
              <View style={styles.budgetTotal}>
                <Text style={styles.budgetTotalLabel}>Total Estimated</Text>
                <Text style={styles.budgetTotalValue}>
                  {formatKES(
                    reminderData
                      .filter(r => r.status !== 'OK')
                      .reduce((sum, r) => sum + r.estimatedCost, 0)
                  )}
                </Text>
              </View>
            )}
          </View>
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
  headerSub: { ...Font.regular, fontSize: 13, color: '#90CAF9', marginTop: 2 },
  headerMileage: { ...Font.medium, fontSize: 12, color: Colors.accent, marginTop: 4 },
  summaryBanner: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE082',
    gap: Spacing.sm,
  },
  summaryIcon: { fontSize: 24 },
  summaryText: { flex: 1 },
  summaryLine: { ...Font.medium, fontSize: 13, color: Colors.textDark, marginBottom: 2 },
  body: { padding: Spacing.lg },
  group: { marginBottom: Spacing.lg },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  groupEmoji: { fontSize: 16 },
  groupLabel: { ...Font.bold, fontSize: 15, flex: 1 },
  groupCount: {
    width: 24, height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCountText: { ...Font.bold, fontSize: 12 },
  budgetCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  budgetTitle: { ...Font.bold, fontSize: 16, color: Colors.textDark, marginBottom: Spacing.md },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  budgetItem: { ...Font.regular, fontSize: 14, color: Colors.textMid },
  budgetCost: { ...Font.semiBold, fontSize: 14, color: Colors.textDark },
  budgetAllGood: { ...Font.medium, fontSize: 14, color: Colors.ok, textAlign: 'center', padding: Spacing.md },
  budgetTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  budgetTotalLabel: { ...Font.bold, fontSize: 15, color: Colors.primary },
  budgetTotalValue: { ...Font.bold, fontSize: 15, color: Colors.primary },
});
