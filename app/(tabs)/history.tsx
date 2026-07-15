// ─── app/(tabs)/history.tsx — Service History with Search & CRUD ──────────────
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Font, Radius, Spacing } from "../../constants/theme";
import {
  formatKES,
  MaintenanceRecord,
  useGlobal,
} from "../../context/GlobalState";
import { searchRecords, updateRecord } from "../../database/db";

const SERVICE_ICONS: Record<string, string> = {
  "Oil Change": "🔧",
  "Brake Pads": "🛑",
  "Air Filter": "🌀",
  "Tire Replacement": "🛞",
  "Spark Plugs": "⚡",
  "Shock Absorbers": "🔩",
  Battery: "🔋",
  "Coolant Flush": "💧",
  "Transmission Service": "🔄",
};

function getIcon(serviceType: string): string {
  for (const key of Object.keys(SERVICE_ICONS)) {
    if (serviceType.toLowerCase().includes(key.toLowerCase()))
      return SERVICE_ICONS[key];
  }
  return "🔧";
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({
  visible,
  record,
  onClose,
  onSave,
}: {
  visible: boolean;
  record: MaintenanceRecord | null;
  onClose: () => void;
  onSave: (id: number, data: Omit<MaintenanceRecord, "id">) => void;
}) {
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [mileage, setMileage] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (record) {
      setServiceType(record.serviceType);
      setDate(record.date);
      setMileage(String(record.mileageAtService));
      setCost(String(record.cost));
      setNotes(record.notes);
    }
  }, [record]);

  function handleSave() {
    if (
      !serviceType.trim() ||
      !date.trim() ||
      !mileage.trim() ||
      !cost.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    onSave(record!.id, {
      serviceType: serviceType.trim(),
      date: date.trim(),
      mileageAtService: parseInt(mileage),
      cost: parseFloat(cost),
      notes: notes.trim(),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>✏️ Edit Record</Text>

          {[
            {
              label: "Service Type",
              value: serviceType,
              setter: setServiceType,
              kb: "default",
            },
            {
              label: "Date (DD/MM/YYYY)",
              value: date,
              setter: setDate,
              kb: "default",
            },
            {
              label: "Mileage (km)",
              value: mileage,
              setter: setMileage,
              kb: "numeric",
            },
            {
              label: "Cost (KES)",
              value: cost,
              setter: setCost,
              kb: "numeric",
            },
          ].map(({ label, value, setter, kb }) => (
            <View key={label} style={styles.modalField}>
              <Text style={styles.modalLabel}>{label}</Text>
              <TextInput
                style={styles.modalInput}
                value={value}
                onChangeText={setter as any}
                keyboardType={kb as any}
                placeholder={label}
                placeholderTextColor="#AAA"
              />
            </View>
          ))}

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Notes (optional)</Text>
            <TextInput
              style={[
                styles.modalInput,
                { height: 70, textAlignVertical: "top" },
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Notes..."
              placeholderTextColor="#AAA"
              multiline
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Record Card ───────────────────────────────────────────────────────────────
function RecordCard({
  record,
  onDelete,
  onEdit,
}: {
  record: MaintenanceRecord;
  onDelete: (id: number) => void;
  onEdit: (record: MaintenanceRecord) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIconWrap}>
        <Text style={styles.cardIcon}>{getIcon(record.serviceType)}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{record.serviceType}</Text>
        <Text style={styles.cardDetail}>
          📅 {record.date} • 🛣️{" "}
          {Number(record.mileageAtService).toLocaleString()} km
        </Text>
        {record.notes ? (
          <Text style={styles.cardNotes}>"{record.notes}"</Text>
        ) : null}
        <Text style={styles.cardCost}>{formatKES(record.cost)}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(record)}>
          <Text style={styles.editTxt}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert("Delete Record", "Remove this service record?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(record.id),
              },
            ])
          }
        >
          <Text style={styles.deleteTxt}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HistoryScreen() {
  const {
    maintenanceRecords,
    deleteMaintenanceRecord,
    refreshRecords,
    totalSpent,
  } = useGlobal();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MaintenanceRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [editRecord, setEditRecord] = useState<MaintenanceRecord | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  // Refresh records every time screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshRecords();
    }, []),
  );

  // Live search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
    } else {
      setIsSearching(true);
      const results = searchRecords(searchQuery);
      setSearchResults(results as MaintenanceRecord[]);
    }
  }, [searchQuery]);

  function handleEdit(record: MaintenanceRecord) {
    setEditRecord(record);
    setEditVisible(true);
  }

  function handleSaveEdit(id: number, data: Omit<MaintenanceRecord, "id">) {
    updateRecord(id, data);
    refreshRecords();
    setEditVisible(false);
    Alert.alert("✅ Updated", "Record updated successfully!");
  }

  const displayed = isSearching ? searchResults : maintenanceRecords;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Service History</Text>
        <Text style={styles.headerSub}>
          {maintenanceRecords.length} records • {formatKES(totalSpent)} total
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by service, date or notes..."
          placeholderTextColor="#AAA"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search result count */}
      {isSearching && (
        <Text style={styles.searchCount}>
          {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
          for "{searchQuery}"
        </Text>
      )}

      {/* List */}
      <View style={{ flex: 1 }}>
        {displayed.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{isSearching ? "🔍" : "🔧"}</Text>
            <Text style={styles.emptyText}>
              {isSearching
                ? "No matching records found."
                : "No service records yet."}
            </Text>
            <Text style={styles.emptyHint}>
              {isSearching
                ? "Try a different search term."
                : "Tap + to log your first service."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayed}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <RecordCard
                record={item}
                onDelete={deleteMaintenanceRecord}
                onEdit={handleEdit}
              />
            )}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={8}
            getItemLayout={(data, index) => ({
              length: 110,
              offset: 110 * index,
              index,
            })}
          />
        )}

        {/* Edit Modal */}
        <EditModal
          visible={editVisible}
          record={editRecord}
          onClose={() => setEditVisible(false)}
          onSave={handleSaveEdit}
        />
      </View>
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
  headerSub: { ...Font.regular, fontSize: 13, color: "#90CAF9", marginTop: 4 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    ...Font.regular,
    color: Colors.textDark,
  },
  clearSearch: { fontSize: 16, color: Colors.textLight, padding: Spacing.xs },
  searchCount: {
    ...Font.medium,
    fontSize: 12,
    color: Colors.textMid,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  card: {
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
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  cardIcon: { fontSize: 22 },
  cardBody: { flex: 1 },
  cardTitle: {
    ...Font.bold,
    fontSize: 15,
    color: Colors.textDark,
    marginBottom: 4,
  },
  cardDetail: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textMid,
    marginBottom: 4,
  },
  cardNotes: {
    ...Font.regular,
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: "italic",
    marginBottom: 4,
  },
  cardCost: { ...Font.bold, fontSize: 14, color: Colors.primary },
  cardActions: { gap: Spacing.sm },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EBF5FB",
    alignItems: "center",
    justifyContent: "center",
  },
  editTxt: { fontSize: 14 },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FADBD8",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteTxt: { fontSize: 14 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.md },
  emptyText: {
    ...Font.bold,
    fontSize: 18,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
  },
  emptyHint: { ...Font.regular, fontSize: 14, color: Colors.textLight },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalTitle: {
    ...Font.bold,
    fontSize: 20,
    color: Colors.textDark,
    marginBottom: Spacing.lg,
  },
  modalField: { marginBottom: Spacing.md },
  modalLabel: {
    ...Font.semiBold,
    fontSize: 13,
    color: Colors.textMid,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    ...Font.regular,
    color: Colors.textDark,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cancelBtnText: { ...Font.bold, fontSize: 15, color: Colors.textMid },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  saveBtnText: { ...Font.bold, fontSize: 15, color: Colors.white },
});
