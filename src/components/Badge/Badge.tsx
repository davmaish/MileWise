import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

interface BadgeProps {
  label: string;

  icon?: ReactNode;

  shape?: "pill" | "rounded";

  backgroundColor?: string;

  textColor?: string;

  style?: StyleProp<ViewStyle>;
}

export default function Badge({
  label,
  icon,
  shape = "pill",
  backgroundColor = colors.action,
  textColor = colors.background,
  style,
}: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        styles[shape],
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
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  pill: {
    borderRadius: radius.pill,
  },

  rounded: {
    borderRadius: radius.md,
  },

  icon: {
    marginRight: spacing.xs,
  },

  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
  },
});
