import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

interface ListItemProps {
  title: string;

  subtitle?: string;

  leading?: ReactNode;

  trailing?: ReactNode;

  onPress?: () => void;

  style?: StyleProp<ViewStyle>;
}

export default function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  style,
}: ListItemProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      {...(onPress && {
        activeOpacity: 0.8,
        onPress,
      })}
    >
      {leading && <View style={styles.leading}>{leading}</View>}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {trailing && <View style={styles.trailing}>{trailing}</View>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,

    backgroundColor: colors.surface,

    borderRadius: radius.md,

    marginBottom: spacing.md,
  },

  leading: {
    marginRight: spacing.md,
  },

  content: {
    flex: 1,
  },

  title: {
    color: colors.text,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,

    marginTop: spacing.xs,
  },

  trailing: {
    marginLeft: spacing.md,
  },
});
