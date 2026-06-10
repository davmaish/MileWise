// ─── app/(tabs)/home.tsx — Dashboard Screen ──────────────────────────────────
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobal, formatKES, getReminderStatus } from '../../context/GlobalState';
import AlertCard from '../../components/AlertCard';
import { Colors, Font, Spacing, Radius } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { userVehicle, totalSpent, nextServiceKm, reminders } = useGlobal();

  // Build reminder display data
  const reminderData = reminders.map(r => {
    const nextAtKm = r.lastServiceMileage + r.intervalKm;
    const currentMileage = userVehicle?.currentMileage ?? 0;
    const remainingKm = Math.max(0, nextAtKm - currentMileage);
    const status = getReminderStatus(remainingKm);
    return { ...r, nextAtKm, remainingKm, status };
  }).sort((a, b) => a.remainingKm - b.remainingKm); // Sort by most urgent first

  const vehicleLabel = userVehicle
    ? `${userVehicle.vehicleName} | ${userVehicle.currentMileage.toLocaleString()} km`
    : 'No vehicle set up';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Top Banner ── */}
        <View style={styles.banner}>
          <View style={styles.bannerTop}>
            <View>
              <Text style={styles.bannerTitle}>MileWise</Text>
              <Text style={styles.bannerSub}>{vehicleLabel}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => router.push('/vehicle-profile')}
            >
              <Text style={styles.profileEmoji}>🚗</Text>
            </TouchableOpacity>
          </View>

          {/* ── Metric Cards ── */}
          <View style={styles.metricRow}>
            <View style={[styles.metricCard, { borderTopColor: Colors.accent }]}>
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

        {/* ── Body ── */}
        <View style={styles.body}>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.push('/(tabs)/add')}
            >
              <Text style={styles.quickBtnIcon}>➕</Text>
              <Text style={styles.quickBtnLabel}>Log Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.push('/(tabs)/alerts')}
            >
              <Text style={styles.quickBtnIcon}>🔔</Text>
              <Text style={styles.quickBtnLabel}>Reminders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.push('/(tabs)/history')}
            >
              <Text style={styles.quickBtnIcon}>📋</Text>
              <Text style={styles.quickBtnLabel}>History</Text>
            </TouchableOpacity>
          </View>

          {/* ── Upcoming Reminders ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/alerts')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {/* Show top 3 most urgent */}
          {reminderData.slice(0, 3).map(r => (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  banner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl + 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  bannerTitle: {
    ...Font.extraBold,
    fontSize: 24,
    color: Colors.white,
  },
  bannerSub: {
    ...Font.regular,
    fontSize: 13,
    color: '#90CAF9',
    marginTop: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 22,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF15',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderTopWidth: 3,
  },
  metricLabel: {
    ...Font.medium,
    fontSize: 12,
    color: '#90CAF9',
    marginBottom: 4,
  },
  metricValue: {
    ...Font.bold,
    fontSize: 18,
    color: Colors.white,
  },
  metricNote: {
    ...Font.regular,
    fontSize: 11,
    color: '#FFFFFF66',
    marginTop: 2,
  },
  body: {
    padding: Spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickBtnIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  quickBtnLabel: {
    ...Font.medium,
    fontSize: 12,
    color: Colors.textMid,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Font.bold,
    fontSize: 17,
    color: Colors.textDark,
  },
  seeAll: {
    ...Font.medium,
    fontSize: 13,
    color: Colors.primary,
  },
});
