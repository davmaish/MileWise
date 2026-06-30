import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { spacing } from "@/theme";

interface SectionProps {
  children: ReactNode;

  style?: StyleProp<ViewStyle>;
}

export default function Section({ children, style }: SectionProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
});
