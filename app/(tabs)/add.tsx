// ─── app/(tabs)/add.tsx — Maintenance Tracker Form ───────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobal, formatKES } from '../../context/GlobalState';
import AppButton from '../../components/AppButton';
import CustomInput from '../../components/CustomInput';
import { Colors, Font, Spacing, Radius } from '../../constants/theme';

const SERVICE_TYPES = [
  '🔧 Oil Change', '🛑 Brake Pads', '🌀 Air Filter',
  '🛞 Tire Replacement', '⚡ Spark Plugs', '🔩 Shock Absorbers',
  '🔋 Battery', '💧 Coolant Flush', '🔄 Transmission Service',
];

export default function AddScreen() {
  const router = useRouter();
  const { addMaintenanceRecord, maintenanceRecords } = useGlobal();

  const [serviceType, setServiceType]   = useState('');
  const [date, setDate]                 = useState('');
  const [mileage, setMileage]           = useState('');
  const [cost, setCost]                 = useState('');
  const [notes, setNotes]               = useState('');

  function handleAdd() {
    if (!serviceType.trim() || !date.trim() || !mileage.trim() || !cost.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in Service Type, Date, Mileage, and Cost.');
      return;
    }
    const mileageNum = parseInt(mileage.replace(/,/g, ''), 10);
    const costNum = parseFloat(cost.replace(/,/g, ''));
    if (isNaN(mileageNum) || isNaN(costNum)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for mileage and cost.');
      return;
    }

    addMaintenanceRecord({
      serviceType: serviceType.trim(),
      date: date.trim(),
      mileageAtService: mileageNum,
      cost: costNum,
      notes: notes.trim(),
    });

    Alert.alert('✅ Record Added', `${serviceType} logged successfully!`, [
      { text: 'Add Another', onPress: clearForm },
      { text: 'View History', onPress: () => router.push('/(tabs)/history') },
    ]);
  }

  function clearForm() {
    setServiceType(''); setDate('');
    setMileage(''); setCost(''); setNotes('');
  }

  function selectQuickService(s: string) {
    // Strip emoji prefix for clean storage
    const clean = s.replace(/^[\p{Emoji}\s]+/u, '').trim();
    setServiceType(clean);
  }

  const recent = maintenanceRecords.slice(0, 4);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Maintenance Tracker</Text>
              <Text style={styles.headerSub}>Log your vehicle services</Text>
            </View>
          </View>

          <View style={styles.body}>
            {/* ── Quick Select Service Type ── */}
            <Text style={styles.sectionLabel}>Quick Select Service</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
              {SERVICE_TYPES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.quickChip,
                    serviceType === s.replace(/^[\p{Emoji}\s]+/u, '').trim() && styles.quickChipActive,
                  ]}
                  onPress={() => selectQuickService(s)}
                >
                  <Text style={[
                    styles.quickChipText,
                    serviceType === s.replace(/^[\p{Emoji}\s]+/u, '').trim() && styles.quickChipTextActive,
                  ]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Form ── */}
            <Text style={styles.sectionLabel}>Service Details</Text>

            <CustomInput
              placeholder="e.g. Oil Change"
              value={serviceType}
              onChangeText={setServiceType}
              label="Service Type"
            />
            <CustomInput
              placeholder="DD/MM/YYYY"
              value={date}
              onChangeText={setDate}
              label="Date"
              keyboardType="numeric"
            />
            <CustomInput
              placeholder="e.g. 84500"
              value={mileage}
              onChangeText={setMileage}
              label="Mileage at Service (km)"
              keyboardType="numeric"
            />
            <CustomInput
              placeholder="e.g. 5000"
              value={cost}
              onChangeText={setCost}
              label="Cost (KES)"
              keyboardType="numeric"
            />
            <CustomInput
              placeholder="Optional notes about the service..."
              value={notes}
              onChangeText={setNotes}
              label="Notes (optional)"
              multiline
              numberOfLines={3}
            />

            <View style={{ height: Spacing.sm }} />

            <AppButton
              title="Add Record"
              onPress={handleAdd}
              backgroundColor={Colors.accent}
              textColor={Colors.textOnAccent}
            />

            {/* ── Recent Records ── */}
            {recent.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionLabel}>Recent Records</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recent.map(r => (
                    <View key={r.id} style={styles.recentPill}>
                      <Text style={styles.recentPillTitle}>{r.serviceType}</Text>
                      <Text style={styles.recentPillDate}>{r.date}</Text>
                      <Text style={styles.recentPillCost}>{formatKES(r.cost)}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingBottom: Spacing.xl },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  backArrow: { fontSize: 22, color: Colors.white, ...Font.bold },
  headerTitle: { ...Font.bold, fontSize: 20, color: Colors.white },
  headerSub: { ...Font.regular, fontSize: 13, color: '#90CAF9', marginTop: 2 },
  body: { padding: Spacing.lg },
  sectionLabel: {
    ...Font.semiBold,
    fontSize: 14,
    color: Colors.textMid,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  quickScroll: { marginBottom: Spacing.lg },
  quickChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickChipText: { ...Font.medium, fontSize: 13, color: Colors.textMid },
  quickChipTextActive: { color: Colors.white },
  recentSection: { marginTop: Spacing.lg },
  recentPill: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginRight: Spacing.md,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  recentPillTitle: { ...Font.bold, fontSize: 13, color: Colors.textDark, marginBottom: 4 },
  recentPillDate: { ...Font.regular, fontSize: 11, color: Colors.textLight, marginBottom: 4 },
  recentPillCost: { ...Font.semiBold, fontSize: 13, color: Colors.primary },
});
