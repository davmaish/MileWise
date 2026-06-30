import { Bell } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import IconButton from "@/components/IconButton";

import { colors, icons, radius, spacing, typography } from "@/theme";

interface DashboardHeaderProps {
  greeting: string;
  userName: string;

  vehicleName: string;
  registrationNumber: string;

  notificationCount?: number;

  onNotificationPress?: () => void;
}

export default function DashboardHeader({
  greeting,
  userName,
  vehicleName,
  registrationNumber,
  notificationCount = 0,
  onNotificationPress,
}: DashboardHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>
          {greeting}, {userName} 👋
        </Text>

        <Text style={styles.subtitle}>
          {vehicleName}
          <Text style={styles.separator}> • </Text>
          {registrationNumber}
        </Text>
      </View>

      <View style={styles.notificationContainer}>
        <IconButton
          shape="rounded"
          variant="filled"
          size="lg"
          accessibilityLabel="Notifications"
          accessibilityHint="View your notifications"
          onPress={onNotificationPress}
          icon={<Bell size={icons.sm} color={colors.text} />}
        />

        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    marginTop: spacing.sm,
  },

  leftSection: {
    flex: 1,
    paddingRight: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: typography.cardTitle.fontSize,
    fontWeight: typography.cardTitle.fontWeight,

    marginBottom: spacing.xs,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
  },

  separator: {
    color: colors.textMuted,
  },

  notificationContainer: {
    position: "relative",
  },

  badge: {
    position: "absolute",

    top: -4,
    right: -4,

    minWidth: 20,
    height: 20,

    borderRadius: radius.pill,

    backgroundColor: colors.action,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 4,
  },

  badgeText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: "700",
  },
});
