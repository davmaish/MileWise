// ─── app/(tabs)/_layout.tsx — Bottom Tab Navigation with Fuel Tab ─────────────
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Font } from "../../constants/theme";

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
  isAdd?: boolean;
}

function TabIcon({ emoji, label, focused, isAdd = false }: TabIconProps) {
  if (isAdd) {
    return (
      <View style={styles.addButton}>
        <Text style={styles.addIcon}>+</Text>
      </View>
    );
  }
  return (
    <View style={styles.tabItem}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="History" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="-" label="Add" focused={focused} isAdd />
          ),
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⛽" label="Fuel" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔔" label="Alerts" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: "#EEEEEE",
    borderTopWidth: 1,
    height: 65,
    paddingBottom: 0,
    paddingTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    gap: 3,
  },
  tabEmoji: { fontSize: 20 },
  tabLabel: { ...Font.medium, fontSize: 10, color: "#AAAAAA" },
  tabLabelActive: { color: Colors.primary, ...Font.bold },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  addIcon: { fontSize: 30, color: Colors.white, ...Font.bold, lineHeight: 34 },
});
