import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import IconButton from "@/components/IconButton";

import { colors, icons, sizes, spacing, typography } from "@/theme";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: ReactNode;
}

export default function Header({
  title,
  showBackButton = true,
  rightComponent,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left Side */}
      <IconButton
        accessibilityLabel="Go back"
        accessibilityHint="Returns to the previous screen"
        onPress={() => router.back()}
        icon={<ArrowLeft size={icons.md} color={colors.text} />}
      />

      {/* Center */}
      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      {/* Right Side */}
      <View style={styles.side}>{rightComponent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: sizes.headerHeight,

    flexDirection: "row",
    alignItems: "center",

    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },

  side: {
    width: sizes.headerLeft,
    alignItems: "center",
    justifyContent: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    ...typography.sectionTitle,
    color: colors.text,
    textAlign: "center",
  },
});
