// ─── app/(tabs)/add.tsx — Maintenance Tracker with Camera & GPS ───────────────
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import {
  capturePhoto,
  getCurrentLocation,
  LocationData,
  PhotoResult,
  pickFromGallery,
} from "../../services/deviceFeatures";
import { notifyRecordSaved } from "../../services/notifications";

const SERVICE_TYPES = [
  "🔧 Oil Change",
  "🛑 Brake Pads",
  "🌀 Air Filter",
  "🛞 Tire Replacement",
  "⚡ Spark Plugs",
  "🔩 Shock Absorbers",
  "🔋 Battery",
  "💧 Coolant Flush",
  "🔄 Transmission Service",
];

export default function AddScreen() {
  const router = useRouter();
  const { addMaintenanceRecord, maintenanceRecords, userVehicle } = useGlobal();

  // Form fields
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [mileage, setMileage] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");

  // Device feature states
  const [photo, setPhoto] = useState<PhotoResult | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Network states
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // ── Camera Handlers ──────────────────────────────────────────────────────
  async function handleCapturePhoto() {
    const result = await capturePhoto();
    if (result) setPhoto(result);
  }

  async function handlePickGallery() {
    const result = await pickFromGallery();
    if (result) setPhoto(result);
  }

  function handleRemovePhoto() {
    Alert.alert("Remove Photo", "Remove the attached photo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setPhoto(null) },
    ]);
  }

  // ── GPS Handler ───────────────────────────────────────────────────────────
  async function handleGetLocation() {
    setGettingLocation(true);
    const result = await getCurrentLocation();
    setGettingLocation(false);
    if (result) {
      setLocation(result);
    }
  }

  // ── Form Submit ───────────────────────────────────────────────────────────
  async function handleAdd() {
    if (
      !serviceType.trim() ||
      !date.trim() ||
      !mileage.trim() ||
      !cost.trim()
    ) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in Service Type, Date, Mileage and Cost.",
      );
      return;
    }
    const mileageNum = parseInt(mileage.replace(/,/g, ""), 10);
    const costNum = parseFloat(cost.replace(/,/g, ""));
    if (isNaN(mileageNum) || isNaN(costNum)) {
      Alert.alert(
        "Invalid Input",
        "Please enter valid numbers for mileage and cost.",
      );
      return;
    }

    setSyncError(null);
    setSyncSuccess(false);
    setSyncing(true);

    // Save locally with photo and location
    addMaintenanceRecord({
      serviceType: serviceType.trim(),
      date: date.trim(),
      mileageAtService: mileageNum,
      cost: costNum,
      notes: notes.trim(),
      photoUri: photo?.uri,
      latitude: location?.latitude,
      longitude: location?.longitude,
      serviceLocation: location?.address,
    });

    // Sync to server
    const result = await syncMaintenanceRecord({
      vehicleId: userVehicle?.registrationNumber ?? "UNKNOWN",
      serviceType: serviceType.trim(),
      date: date.trim(),
      mileageAtService: mileageNum,
      cost: costNum,
      notes: notes.trim(),
    });

    setSyncing(false);

    if (result.success) {
      setSyncSuccess(true);
      // Send notification when record is saved
      await notifyRecordSaved(serviceType.trim(), costNum);
      clearForm();
      setTimeout(() => setSyncSuccess(false), 3000);
    } else {
      setSyncError(result.error);
    }
  }

  function clearForm() {
    setServiceType("");
    setDate("");
    setMileage("");
    setCost("");
    setNotes("");
    setPhoto(null);
    setLocation(null);
    setSyncError(null);
  }

  function selectQuickService(s: string) {
    const clean = s.replace(/^[\p{Emoji}\s]+/u, "").trim();
    setServiceType(clean);
    setSyncError(null);
  }

  const recent = maintenanceRecords.slice(0, 4);

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
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home")}
              style={styles.backBtn}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Maintenance Tracker</Text>
              <Text style={styles.headerSub}>Log your vehicle services</Text>
            </View>
          </View>

          <View style={styles.body}>
            {/* ── Error Banner ── */}
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

            {/* ── Success Banner ── */}
            {syncSuccess && (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>
                  ✅ Record saved and synced!
                </Text>
              </View>
            )}

            {/* ── Quick Select ── */}
            <Text style={styles.sectionLabel}>Quick Select Service</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickScroll}
            >
              {SERVICE_TYPES.map((s) => {
                const clean = s.replace(/^[\p{Emoji}\s]+/u, "").trim();
                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.quickChip,
                      serviceType === clean && styles.quickChipActive,
                    ]}
                    onPress={() => selectQuickService(s)}
                  >
                    <Text
                      style={[
                        styles.quickChipText,
                        serviceType === clean && styles.quickChipTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ── Form Fields ── */}
            <Text style={styles.sectionLabel}>Service Details</Text>
            <CustomInput
              placeholder="e.g. Oil Change"
              value={serviceType}
              onChangeText={(t) => {
                setServiceType(t);
                setSyncError(null);
              }}
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
              placeholder="Optional notes..."
              value={notes}
              onChangeText={setNotes}
              label="Notes (optional)"
              multiline
              numberOfLines={3}
            />

            {/* ── Camera Section ── */}
            <Text style={styles.sectionLabel}>📷 Receipt / Vehicle Photo</Text>
            {photo ? (
              <View style={styles.photoPreview}>
                <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removePhoto}
                  onPress={handleRemovePhoto}
                >
                  <Text style={styles.removePhotoText}>✕ Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity
                  style={styles.photoBtn}
                  onPress={handleCapturePhoto}
                >
                  <Text style={styles.photoBtnIcon}>📷</Text>
                  <Text style={styles.photoBtnText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoBtn}
                  onPress={handlePickGallery}
                >
                  <Text style={styles.photoBtnIcon}>🖼️</Text>
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── GPS Section ── */}
            <Text style={styles.sectionLabel}>📍 Service Location</Text>
            {location ? (
              <View style={styles.locationCard}>
                <Text style={styles.locationIcon}>📍</Text>
                <View style={styles.locationInfo}>
                  {location.address && (
                    <Text style={styles.locationAddress}>
                      {location.address}
                    </Text>
                  )}
                  <Text style={styles.locationCoords}>
                    {location.latitude.toFixed(6)},{" "}
                    {location.longitude.toFixed(6)}
                  </Text>
                  {location.accuracy && (
                    <Text style={styles.locationAccuracy}>
                      Accuracy: ±{location.accuracy.toFixed(0)}m
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => setLocation(null)}>
                  <Text style={styles.locationRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.gpsBtn}
                onPress={handleGetLocation}
                disabled={gettingLocation}
              >
                {gettingLocation ? (
                  <View style={styles.gpsBtnInner}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.gpsBtnText}>Getting location...</Text>
                  </View>
                ) : (
                  <View style={styles.gpsBtnInner}>
                    <Text style={styles.gpsBtnIcon}>📍</Text>
                    <Text style={styles.gpsBtnText}>Get Current Location</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            <View style={{ height: Spacing.md }} />

            {/* ── Add Record Button ── */}
            <TouchableOpacity
              style={[styles.addBtn, syncing && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={syncing}
              activeOpacity={0.82}
            >
              {syncing ? (
                <View style={styles.addBtnInner}>
                  <ActivityIndicator color={Colors.textOnAccent} size="small" />
                  <Text style={styles.addBtnText}>Syncing to server...</Text>
                </View>
              ) : (
                <Text style={styles.addBtnText}>Add Record</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.syncNote}>
              📡 Records are saved locally and synced to server automatically
            </Text>

            {/* ── Recent Records ── */}
            {recent.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionLabel}>Recent Records</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recent.map((r) => (
                    <View key={r.id} style={styles.recentPill}>
                      <Text style={styles.recentPillTitle}>
                        {r.serviceType}
                      </Text>
                      <Text style={styles.recentPillDate}>{r.date}</Text>
                      <Text style={styles.recentPillCost}>
                        {formatKES(r.cost)}
                      </Text>
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
    flexDirection: "row",
    alignItems: "center",
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
  headerSub: { ...Font.regular, fontSize: 13, color: "#90CAF9", marginTop: 2 },
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
  successBanner: {
    backgroundColor: "#EFFAF3",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.ok,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  successText: { ...Font.bold, fontSize: 14, color: Colors.ok },
  sectionLabel: {
    ...Font.semiBold,
    fontSize: 14,
    color: Colors.textMid,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
    textTransform: "uppercase",
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

  // Camera
  photoButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  photoBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  photoBtnIcon: { fontSize: 24, marginBottom: 4 },
  photoBtnText: { ...Font.medium, fontSize: 13, color: Colors.textMid },
  photoPreview: {
    marginBottom: Spacing.md,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  photoImage: { width: "100%", height: 200, borderRadius: Radius.md },
  removePhoto: {
    backgroundColor: "#FF000022",
    padding: Spacing.sm,
    alignItems: "center",
    marginTop: Spacing.xs,
    borderRadius: Radius.sm,
  },
  removePhotoText: { ...Font.bold, fontSize: 13, color: Colors.urgent },

  // GPS
  gpsBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    marginBottom: Spacing.md,
  },
  gpsBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  gpsBtnIcon: { fontSize: 20 },
  gpsBtnText: { ...Font.medium, fontSize: 14, color: Colors.primary },
  locationCard: {
    backgroundColor: "#EBF5FB",
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "#90CAF9",
    gap: Spacing.sm,
  },
  locationIcon: { fontSize: 20 },
  locationInfo: { flex: 1 },
  locationAddress: {
    ...Font.bold,
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 2,
  },
  locationCoords: { ...Font.regular, fontSize: 12, color: Colors.textMid },
  locationAccuracy: {
    ...Font.regular,
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
  locationRemove: { fontSize: 18, color: Colors.textLight, padding: 2 },

  // Add button
  addBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: { backgroundColor: "#FFE082", opacity: 0.85 },
  addBtnInner: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  addBtnText: { ...Font.bold, fontSize: 16, color: Colors.textOnAccent },
  syncNote: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  recentSection: { marginTop: Spacing.lg },
  recentPill: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginRight: Spacing.md,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  recentPillTitle: {
    ...Font.bold,
    fontSize: 13,
    color: Colors.textDark,
    marginBottom: 4,
  },
  recentPillDate: {
    ...Font.regular,
    fontSize: 11,
    color: Colors.textLight,
    marginBottom: 4,
  },
  recentPillCost: { ...Font.semiBold, fontSize: 13, color: Colors.primary },
});
