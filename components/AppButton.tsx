// ─── AppButton Component ──────────────────────────────────────────────────────
import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator,
} from 'react-native';
import { Colors, Radius, Font } from '../constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

export default function AppButton({
  title, onPress,
  backgroundColor = Colors.accent,
  textColor = Colors.textOnAccent,
  borderColor,
  style, textStyle,
  disabled = false,
  loading = false,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[
        styles.button,
        { backgroundColor, borderColor: borderColor ?? 'transparent', borderWidth: borderColor ? 2 : 0 },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Font.bold,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
