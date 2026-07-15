// ─── CustomInput Component ────────────────────────────────────────────────────
import React from 'react';
import {
  View, TextInput, Text, StyleSheet, ViewStyle, KeyboardTypeOptions,
} from 'react-native';
import { Colors, Font, Radius, Spacing } from '../constants/theme';

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  onDark?: boolean; // true = light input on dark background
}

export default function CustomInput({
  placeholder, value, onChangeText,
  label,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  style,
  onDark = false,
}: CustomInputProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={[styles.label, onDark && styles.labelDark]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          onDark ? styles.inputOnDark : styles.inputOnLight,
          multiline && { height: numberOfLines * 44, textAlignVertical: 'top', paddingTop: 12 },
        ]}
        placeholder={placeholder}
        placeholderTextColor={onDark ? '#8899CC' : '#AAAAAA'}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  label: {
    ...Font.semiBold,
    fontSize: 13,
    color: Colors.textMid,
    marginBottom: Spacing.xs,
  },
  labelDark: {
    color: '#90CAF9',
  },
  input: {
    width: '100%',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRadius: Radius.md,
    fontSize: 15,
    ...Font.regular,
  },
  inputOnDark: {
    backgroundColor: '#FFFFFF',
    color: Colors.textDark,
  },
  inputOnLight: {
    backgroundColor: Colors.inputBg,
    color: Colors.textDark,
  },
});
