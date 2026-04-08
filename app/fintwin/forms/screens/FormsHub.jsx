import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OneTimePurchaseForm from "./OneTimePurchaseForm";
import EMIPurchaseForm from "./EMIPurchaseForm";
import IncomeChangeForm from "./IncomeChangeForm";
import RunwayCalculator from "./RunwayCalculator";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

const tabs = [
  { key: "ONE_TIME", label: "One-time", icon: "card-outline" },
  { key: "EMI", label: "EMI", icon: "repeat-outline" },
  { key: "INCOME_UP", label: "Income +", icon: "trending-up-outline" },
  { key: "INCOME_DOWN", label: "Income -", icon: "trending-down-outline" },
  { key: "RUNWAY", label: "Runway", icon: "time-outline" },
];

export default function FormsHub() {
  const [active, setActive] = useState("ONE_TIME");

  const renderActive = () => {
    switch (active) {
      case "ONE_TIME":
        return <OneTimePurchaseForm />;
      case "EMI":
        return <EMIPurchaseForm />;
      case "INCOME_UP":
        return <IncomeChangeForm type="INCREASE" />;
      case "INCOME_DOWN":
        return <IncomeChangeForm type="DECREASE" />;
      case "RUNWAY":
        return <RunwayCalculator />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forms</Text>
        <Text style={styles.hint}>Manage expenses and income scenarios</Text>
      </View>

      <View style={styles.topNav} pointerEvents="box-none">
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setActive(t.key)}
            style={[styles.tab, active === t.key && styles.tabActive]}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={t.icon}
                size={18}
                color={active === t.key ? colors.white : colors.textSecondary}
              />
              <Text style={[styles.tabText, active === t.key && styles.tabTextActive]}>{t.label}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.main}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {renderActive()}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacing.sm, paddingBottom: spacing.sm },
  header: { paddingHorizontal: spacing.xs, paddingVertical: spacing.sm },
  title: { fontSize: fontSizes.lg, fontWeight: "800", color: colors.textPrimary },
  hint: { fontSize: fontSizes.xs, color: colors.textSecondary, marginTop: 2 },
  main: { flex: 1 },
  body: { paddingVertical: spacing.md, paddingBottom: spacing.xxl, paddingHorizontal: 2 },
  topNav: {
    height: 64,
    marginHorizontal: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    ...shadows.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: spacing.md,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: "transparent",
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.white,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
});
