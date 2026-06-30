import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "@/theme";

interface ProgressBarProps {
  progress: number;

  color?: string;

  trackColor?: string;

  height?: number;

  style?: StyleProp<ViewStyle>;
}

export default function ProgressBar({
  progress,
  color = colors.success,
  trackColor = colors.border,
  height = 6,
  style,
}: ProgressBarProps) {
  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: trackColor,
          height,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${Math.max(0, Math.min(progress, 100))}%`,
            backgroundColor: color,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },

  fill: {
    height: "100%",
  },
});
