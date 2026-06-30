import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

interface StatusChipProps {
  label: string;

  icon?: ReactNode;

  backgroundColor?: string;

  textColor?: string;

  style?: StyleProp<ViewStyle>;
}

export default function StatusChip({
  label,
  icon,
  backgroundColor = colors.surface,
  textColor = colors.text,
  style,
}: StatusChipProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}

      <Text
        style={[
          styles.label,
          {
            color: textColor,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    minHeight: 34,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,

    borderRadius: radius.pill,
  },

  icon: {
    marginRight: spacing.xs,
  },

  label: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});
