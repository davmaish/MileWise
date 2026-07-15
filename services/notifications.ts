// ─── services/notifications.ts — Local Notifications (SDK 54 compatible) ─────
import * as Notifications from "expo-notifications";

// Configure how notifications appear when app is in foreground

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
// ── Request Permission ────────────────────────────────────────────────────────
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  } catch {
    // Silently fail if notifications not supported in current environment
    return false;
  }
}

// ── Send Local Notification ───────────────────────────────────────────────────
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: data ?? {}, sound: true },
      trigger: null,
    });
  } catch {
    // Silently fail — notifications are a bonus feature, not critical
  }
  console.log("🔔 Notification sent:", title, body);
}

// ── Specific Notifications ────────────────────────────────────────────────────
export async function notifyRecordSaved(
  serviceType: string,
  cost: number,
): Promise<void> {
  await sendLocalNotification(
    "✅ Service Record Saved",
    `${serviceType} logged — KES ${cost.toLocaleString()}`,
    { type: "record_saved" },
  );
}

export async function notifyFuelLogSaved(
  liters: number,
  totalCost: number,
): Promise<void> {
  await sendLocalNotification(
    "⛽ Fuel Log Saved",
    `${liters}L logged — KES ${totalCost.toLocaleString()}`,
    { type: "fuel_saved" },
  );
}

export async function notifyServiceDue(
  serviceName: string,
  kmRemaining: number,
): Promise<void> {
  await sendLocalNotification(
    "🔔 Service Due Soon",
    `${serviceName} is due in ${kmRemaining.toLocaleString()} km`,
    { type: "service_reminder" },
  );
}
