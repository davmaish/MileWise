// ─── app/(tabs)/fuel.tsx — Fuel Log Screen ───────────────────────────────────
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../../components/CustomInput";
import { Colors, Font, Radius, Spacing } from "../../constants/theme";
import { formatKES, useGlobal } from "../../context/GlobalState";
import { syncMaintenanceRecord } from "../../services/api";

export default function FuelScreen() {
  const {
    fuelLogs,
    addFuelLog,
    deleteFuelLog,
    totalFuelSpent,
    refreshRecords,
    userVehicle,
  } = useGlobal();

  const [liters, setLiters] = useState("");
  const [costPerLiter, setCostPerLiter] = useState("");
  const [mileage, setMileage] = useState("");
  const [date, setDate] = useState("");
  const [stationName, setStationName] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshRecords();
    }, []),
  );

  const totalCost =
    liters && costPerLiter
      ? (parseFloat(liters) * parseFloat(costPerLiter)).toFixed(2)
      : "0.00";

  const avgConsumption =
    fuelLogs.length >= 2
      ? (() => {
          const sorted = [...fuelLogs].sort(
            (a, b) => a.mileage_at_fillup - b.mileage_at_fillup,
          );
          const totalKm =
            sorted[sorted.length - 1].mileage_at_fillup -
            sorted[0].mileage_at_fillup;
          const totalLiters = sorted
            .slice(1)
            .reduce((sum, l) => sum + l.liters, 0);
          return totalKm > 0
            ? ((totalLiters / totalKm) * 100).toFixed(1)
            : null;
        })()
      : null;

  async function handleAddFuelLog() {
    if (
      !liters.trim() ||
      !costPerLiter.trim() ||
      !mileage.trim() ||
      !date.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in Liters, Cost/Liter, Mileage and Date.",
      );
      return;
    }
    const litersNum = parseFloat(liters);
    const costPerLiterNum = parseFloat(costPerLiter);
    const mileageNum = parseInt(mileage.replace(/,/g, ""), 10);
    const totalCostNum = litersNum * costPerLiterNum;

    if (isNaN(litersNum) || isNaN(costPerLiterNum) || isNaN(mileageNum)) {
      Alert.alert("Invalid Input", "Please enter valid numbers.");
      return;
    }

    setSyncing(true);
    setSyncError(null);

    // Step 1: Save locally first
    addFuelLog({
      liters: litersNum,
      costPerLiter: costPerLiterNum,
      totalCost: totalCostNum,
      mileageAtFillup: mileageNum,
      date: date.trim(),
      stationName: stationName.trim() || undefined,
    });

    // Step 2: Sync to server
    const result = await syncMaintenanceRecord({
      vehicleId: userVehicle?.registrationNumber ?? "UNKNOWN",
      serviceType: `Fuel Fill-up — ${litersNum}L`,
      date: date.trim(),
      mileageAtService: mileageNum,
      cost: totalCostNum,
      notes: stationName.trim() || "No station name",
    });

    setSyncing(false);

    if (result.success) {
      clearForm();
      Alert.alert("✅ Fuel Log Added", `${litersNum}L logged successfully!`);
    } else {
      setSyncError(result.error);
    }
  }

  function clearForm() {
    setLiters("");
    setCostPerLiter("");
    setMileage("");
    setDate("");
    setStationName("");
    setSyncError(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⛽ Fuel Tracker</Text>
            <Text style={styles.headerSub}>Log every fill-up</Text>
          </View>

          {/* ── Stats Row ── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Fuel Spent</Text>
              <Text style={styles.statValue}>{formatKES(totalFuelSpent)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Fill-ups Logged</Text>
              <Text style={styles.statValue}>{fuelLogs.length}</Text>
            </View>
            {avgConsumption && (
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Avg Consumption</Text>
                <Text style={styles.statValue}>{avgConsumption} L/100km</Text>
              </View>
            )}
          </View>

          <View style={styles.body}>
            {/* ── Sync Error Banner ── */}
            {syncError && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.errorTitle}>
                    Sync Failed — Saved Locally
                  </Text>
                  <Text style={styles.errorMsg}>{syncError}</Text>
                </View>
                <TouchableOpacity onPress={() => setSyncError(null)}>
                  <Text style={styles.errorClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── Form ── */}
            <Text style={styles.sectionLabel}>Log New Fill-Up</Text>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <CustomInput
                  label="Liters"
                  placeholder="e.g. 40"
                  value={liters}
                  onChangeText={setLiters}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="Cost per Liter (KES)"
                  placeholder="e.g. 180"
                  value={costPerLiter}
                  onChangeText={setCostPerLiter}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Auto-calculated total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Cost:</Text>
              <Text style={styles.totalValue}>
                KES {Number(totalCost).toLocaleString()}
              </Text>
            </View>

            <CustomInput
              label="Mileage at Fill-up (km)"
              placeholder="e.g. 84500"
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
            />
            <CustomInput
              label="Date (DD/MM/YYYY)"
              placeholder="e.g. 17/06/2026"
              value={date}
              onChangeText={setDate}
            />
            <CustomInput
              label="Station Name (optional)"
              placeholder="e.g. Total Energies Westlands"
              value={stationName}
              onChangeText={setStationName}
            />

            <View style={{ height: Spacing.sm }} />

            {/* Add Button */}
            <TouchableOpacity
              style={[styles.addBtn, syncing && styles.addBtnDisabled]}
              onPress={handleAddFuelLog}
              disabled={syncing}
              activeOpacity={0.82}
            >
              <Text style={styles.addBtnText}>
                {syncing ? "Saving..." : "⛽ Log Fill-Up"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.syncNote}>
              📡 Saved locally and synced to server automatically
            </Text>

            {/* ── Fuel Log History ── */}
            {fuelLogs.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.sectionLabel}>Fill-Up History</Text>
                {fuelLogs.map((log) => (
                  <View key={log.id} style={styles.logCard}>
                    <View style={styles.logLeft}>
                      <Text style={styles.logIcon}>⛽</Text>
                    </View>
                    <View style={styles.logBody}>
                      <Text style={styles.logTitle}>
                        {log.liters}L @ KES {log.cost_per_liter}/L
                      </Text>
                      <Text style={styles.logDetail}>
                        📅 {log.date} • 🛣️{" "}
                        {Number(log.mileage_at_fillup).toLocaleString()} km
                      </Text>
                      {log.station_name ? (
                        <Text style={styles.logStation}>
                          📍 {log.station_name}
                        </Text>
                      ) : null}
                      <Text style={styles.logCost}>
                        {formatKES(log.total_cost)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() =>
                        Alert.alert("Delete", "Remove this fuel log?", [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteFuelLog(log.id),
                          },
                        ])
                      }
                    >
                      <Text style={styles.deleteTxt}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {fuelLogs.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>⛽</Text>
                <Text style={styles.emptyText}>No fuel logs yet.</Text>
                <Text style={styles.emptyHint}>
                  Log your first fill-up above!
                </Text>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { ...Font.bold, fontSize: 22, color: Colors.white },
  headerSub: { ...Font.regular, fontSize: 13, color: "#90CAF9", marginTop: 2 },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderTopWidth: 3,
    borderTopColor: Colors.accent,
  },
  statLabel: {
    ...Font.medium,
    fontSize: 11,
    color: Colors.textMid,
    marginBottom: 4,
  },
  statValue: {
    ...Font.bold,
    fontSize: 15,
    color: Colors.primary,
    textAlign: "center",
  },
  body: { padding: Spacing.lg },
  errorBanner: {
    backgroundColor: "#FFF0F0",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.urgent,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  errorIcon: { fontSize: 20 },
  errorTitle: {
    ...Font.bold,
    fontSize: 13,
    color: Colors.urgent,
    marginBottom: 2,
  },
  errorMsg: { ...Font.regular, fontSize: 12, color: "#C0392B", lineHeight: 18 },
  errorClose: { fontSize: 16, color: Colors.urgent, padding: 2 },
  sectionLabel: {
    ...Font.semiBold,
    fontSize: 14,
    color: Colors.textMid,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  row: { flexDirection: "row" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  totalLabel: { ...Font.semiBold, fontSize: 14, color: Colors.textMid },
  totalValue: { ...Font.bold, fontSize: 16, color: Colors.primary },
  addBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: { opacity: 0.7 },
  addBtnText: { ...Font.bold, fontSize: 16, color: Colors.textOnAccent },
  syncNote: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  historySection: { marginTop: Spacing.lg },
  logCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  logLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  logIcon: { fontSize: 20 },
  logBody: { flex: 1 },
  logTitle: {
    ...Font.bold,
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 3,
  },
  logDetail: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textMid,
    marginBottom: 2,
  },
  logStation: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  logCost: { ...Font.bold, fontSize: 13, color: Colors.primary, marginTop: 2 },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FADBD8",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteTxt: { fontSize: 14 },
  empty: { alignItems: "center", paddingVertical: Spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: {
    ...Font.bold,
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 4,
  },
  emptyHint: { ...Font.regular, fontSize: 13, color: Colors.textLight },
});
