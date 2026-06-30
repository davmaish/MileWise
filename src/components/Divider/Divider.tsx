import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { borders, sizes, spacing } from "@/theme";

interface DividerProps {
  marginVertical?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Divider({
  marginVertical = spacing.md,
  style,
}: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        {
          marginVertical,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: sizes.divider,
    backgroundColor: borders.color,
  },
});
