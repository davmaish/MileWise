import { Tabs } from "expo-router";
import { ChartColumn, History, House, User, Wrench } from "lucide-react-native";

import { navigation, spacing, typography } from "@/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: navigation.activeTint,

        tabBarInactiveTintColor: navigation.inactiveTint,

        tabBarStyle: {
          backgroundColor: navigation.background,

          borderTopColor: navigation.borderColor,
          borderTopWidth: 1,

          height: navigation.tabBarHeight,

          overflow: "hidden",

          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
        },

        tabBarLabelStyle: {
          fontSize: typography.caption.fontSize,
          fontWeight: typography.caption.fontWeight,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",

          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="maintenance"
        options={{
          title: "Maintenance",

          tabBarIcon: ({ color, size }) => <Wrench color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Logs",

          tabBarIcon: ({ color, size }) => (
            <ChartColumn color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
