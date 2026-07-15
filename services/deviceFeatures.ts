// ─── services/deviceFeatures.ts — Camera, GPS & Permissions ─────────────────
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Alert } from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address?: string;
}

export interface PhotoResult {
  uri: string;
  width: number;
  height: number;
}

// ── Camera Permission & Capture ───────────────────────────────────────────────
export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Camera Permission Required",
      "MileWise needs camera access to capture service receipts and vehicle photos. Please enable it in your device settings.",
      [{ text: "OK" }],
    );
    return false;
  }
  return true;
}

export async function capturePhoto(): Promise<PhotoResult | null> {
  // Request permission first
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) return null;

  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduced from 0.8 to 0.5 for better memory performance
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      };
    }
    return null;
  } catch (error) {
    Alert.alert("Camera Error", "Unable to open camera. Please try again.");
    return null;
  }
}

export async function pickFromGallery(): Promise<PhotoResult | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Gallery Permission Required",
      "MileWise needs gallery access to select receipt photos.",
      [{ text: "OK" }],
    );
    return null;
  }

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      return { uri: asset.uri, width: asset.width, height: asset.height };
    }
    return null;
  } catch (error) {
    Alert.alert("Gallery Error", "Unable to open gallery. Please try again.");
    return null;
  }
}

// ── GPS Location ──────────────────────────────────────────────────────────────
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Location Permission Required",
      "MileWise needs location access to record where your vehicle was serviced.",
      [{ text: "OK" }],
    );
    return false;
  }
  return true;
}

export async function getCurrentLocation(): Promise<LocationData | null> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  try {
    // Check if location services are enabled
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "GPS Disabled",
        "Please enable location services on your device to record service location.",
        [{ text: "OK" }],
      );
      return null;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    // Reverse geocode to get address
    const geocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const place = geocode[0];
    const address = place
      ? `${place.name ?? ""}, ${place.street ?? ""}, ${place.city ?? ""}`
          .replace(/^,\s*|,\s*$/g, "")
          .trim()
      : undefined;

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      address,
    };
  } catch (error) {
    Alert.alert(
      "GPS Error",
      "Unable to retrieve location. Please ensure GPS is enabled and try again.",
    );
    return null;
  }
}
