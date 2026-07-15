// ─── AlertCard Component ──────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Font, Radius, Spacing } from '../constants/theme';
import { ReminderStatus, formatKES } from '../context/GlobalState';

interface AlertCardProps {
  icon: string;
  name: string;
  remainingKm: number;
  nextAtKm: number;
  estimatedCost: number;
  status: ReminderStatus;
}

const STATUS_CONFIG: Record<ReminderStatus, { color: string; label: string; bg: string }> = {
  URGENT: { color: Colors.urgent, label: 'URGENT', bg: '#FFF0EF' },
  SOON:   { color: Colors.soon,   label: 'SOON',   bg: '#FFF6EC' },
  OK:     { color: Colors.ok,     label: 'OK',     bg: '#EFFAF3' },
};

export default function AlertCard({ icon, name, remainingKm, nextAtKm, estimatedCost, status }: AlertCardProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.card, { borderLeftColor: config.color }]}>
      {/* Left dot indicator */}
      <View style={[styles.dot, { backgroundColor: config.color }]} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name}>{icon}  {name}</Text>
        <Text style={styles.detail}>Due in <Text style={[styles.detailBold, { color: config.color }]}>{remainingKm.toLocaleString()} km</Text></Text>
        <Text style={styles.detail}>Next at <Text style={styles.detailBold}>{nextAtKm.toLocaleString()} km</Text></Text>
        <Text style={styles.cost}>Est. Cost: <Text style={{ color: Colors.primary }}>{formatKES(estimatedCost)}</Text></Text>
      </View>

      {/* Status badge */}
      <View style={[styles.badge, { backgroundColor: config.bg }]}>
        <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dot: {
    width: 10, height: 10,
    borderRadius: 5,
    marginRight: Spacing.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  content: { flex: 1 },
  name: {
    ...Font.bold,
    fontSize: 15,
    color: Colors.textDark,
    marginBottom: 4,
  },
  detail: {
    ...Font.regular,
    fontSize: 13,
    color: Colors.textMid,
    marginBottom: 2,
  },
  detailBold: {
    ...Font.semiBold,
    color: Colors.textDark,
  },
  cost: {
    ...Font.semiBold,
    fontSize: 13,
    color: Colors.textMid,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginLeft: Spacing.sm,
  },
  badgeText: {
    ...Font.bold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
