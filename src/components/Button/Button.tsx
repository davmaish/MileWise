import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { colors, radius, sizes, spacing, typography } from "@/theme";

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.black} />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: sizes.buttonHeight,
    backgroundColor: colors.action,
    borderRadius: radius.md,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: spacing.lg,
  },

  text: {
    ...typography.button,
    color: colors.background,
  },

  disabled: {
    opacity: 0.5,
  },
});
