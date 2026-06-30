import React, { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { borders, colors, radius, sizes } from "@/theme";

type IconButtonVariant = "ghost" | "filled" | "outlined";
type IconButtonSize = "sm" | "md" | "lg";
type IconButtonShape = "rounded" | "pill";

interface IconButtonProps {
  icon: ReactNode;

  onPress?: () => void;

  variant?: IconButtonVariant;

  size?: IconButtonSize;

  shape?: IconButtonShape;

  disabled?: boolean;

  accessibilityLabel: string;

  accessibilityHint?: string;

  style?: StyleProp<ViewStyle>;
}

export default function IconButton({
  icon,
  onPress,
  variant = "ghost",
  size = "md",
  shape = "rounded",
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  style,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[
        styles.base,
        styles[size],
        styles[shape],
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
  },

  sm: {
    width: sizes.iconButtonSm,
    height: sizes.iconButtonSm,
  },

  md: {
    width: sizes.iconButtonMd,
    height: sizes.iconButtonMd,
  },

  lg: {
    width: sizes.iconButtonLg,
    height: sizes.iconButtonLg,
  },

  ghost: {
    backgroundColor: "transparent",
  },

  filled: {
    backgroundColor: colors.surfaceVariant,
  },

  outlined: {
    backgroundColor: "transparent",

    borderWidth: borders.width,
    borderColor: borders.color,
  },
  rounded: {
    borderRadius: radius.md,
  },

  pill: {
    borderRadius: radius.pill,
  },

  disabled: {
    opacity: 0.4,
  },
});
