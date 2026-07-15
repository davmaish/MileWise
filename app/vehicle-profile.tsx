// ─── app/vehicle-profile.tsx — Vehicle Setup Screen ──────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobal } from '../context/GlobalState';
import AppButton from '../components/AppButton';
import CustomInput from '../components/CustomInput';
import { Colors, Font, Spacing, Radius } from '../constants/theme';

export default function VehicleProfileScreen() {
  const router = useRouter();
  const { setUserVehicle } = useGlobal();

  const [vehicleName, setVehicleName]             = useState('');
  const [manufacturer, setManufacturer]           = useState('');
  const [model, setModel]                         = useState('');
  const [year, setYear]                           = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [currentMileage, setCurrentMileage]       = useState('');

  function handleSave() {
    // Validation
    if (!vehicleName.trim() || !manufacturer.trim() || !model.trim() ||
        !year.trim() || !registrationNumber.trim() || !currentMileage.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in all fields before saving.');
      return;
    }
    const mileage = parseInt(currentMileage.replace(/,/g, ''), 10);
    if (isNaN(mileage) || mileage < 0) {
      Alert.alert('Invalid Mileage', 'Please enter a valid mileage number.');
      return;
    }
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Invalid Year', 'Please enter a valid manufacture year.');
      return;
    }

    // Save to context
    setUserVehicle({
      vehicleName: vehicleName.trim(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      year: year.trim(),
      registrationNumber: registrationNumber.trim().toUpperCase(),
      currentMileage: mileage,
    });

    // Navigate to dashboard
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>my vehicle</Text>
              <Text style={styles.headerSubtitle}>Tell us about your vehicle</Text>
            </View>
          </View>

          {/* ── Vehicle Icon ── */}
          <View style={styles.iconWrap}>
            <Text style={styles.vehicleIcon}>🚗</Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            <CustomInput
              placeholder="e.g. Toyota Corolla"
              value={vehicleName}
              onChangeText={setVehicleName}
              label="Vehicle Name"
              onDark
            />
            <CustomInput
              placeholder="e.g. Toyota"
              value={manufacturer}
              onChangeText={setManufacturer}
              label="Manufacturer"
              onDark
            />
            <CustomInput
              placeholder="e.g. Corolla"
              value={model}
              onChangeText={setModel}
              label="Model"
              onDark
            />
            <CustomInput
              placeholder="e.g. 2020"
              value={year}
              onChangeText={setYear}
              label="Year"
              keyboardType="numeric"
              onDark
            />
            <CustomInput
              placeholder="e.g. KDG 123A"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              label="Registration Number"
              autoCapitalize="characters"
              onDark
            />
            <CustomInput
              placeholder="e.g. 84500"
              value={currentMileage}
              onChangeText={setCurrentMileage}
              label="Current Mileage (km)"
              keyboardType="numeric"
              onDark
            />

            <View style={{ height: Spacing.md }} />

            <AppButton
              title="Save Vehicle"
              onPress={handleSave}
              backgroundColor={Colors.accent}
              textColor={Colors.textOnAccent}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  backBtn: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.white,
    ...Font.bold,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    ...Font.bold,
    fontSize: 26,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    ...Font.regular,
    fontSize: 14,
    color: '#90CAF9',
    marginTop: 2,
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  vehicleIcon: {
    fontSize: 64,
  },
  form: {
    width: '100%',
  },
});
