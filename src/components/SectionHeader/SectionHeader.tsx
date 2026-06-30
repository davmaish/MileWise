import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors, spacing, typography } from "@/theme";

interface SectionHeaderProps {
  title: string;

  subtitle?: string;

  action?: ReactNode;

  style?: StyleProp<ViewStyle>;
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: spacing.md,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: colors.text,
    fontSize: typography.sectionTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,

    marginTop: spacing.xs,
  },

  actionContainer: {
    marginLeft: spacing.md,
  },
});
