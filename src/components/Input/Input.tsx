import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { borders, colors, radius, sizes, spacing, typography } from "@/theme";

interface InputProps extends TextInputProps {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    color: colors.text,
    marginBottom: spacing.sm,
    ...typography.label,
  },

  input: {
    height: sizes.inputHeight,

    borderRadius: radius.md, // 12 after your update

    borderWidth: borders.width,
    borderColor: borders.color,

    backgroundColor: colors.surface,

    paddingHorizontal: spacing.md,

    color: colors.text,

    ...typography.body,
  },
});
