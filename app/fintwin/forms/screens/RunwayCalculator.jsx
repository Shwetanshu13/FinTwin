import { View, Text, StyleSheet } from "react-native";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";
import { useState } from "react";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";

export default function RunwayCalculator() {
  const [savings, setSavings] = useState("");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [runway, setRunway] = useState(null);

  const calculate = () => {
    const netBurn = Number(income) - Number(expenses);
    const months = netBurn >= 0 ? Infinity : Math.floor(Number(savings) / Math.abs(netBurn));
    setRunway(months);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Runway Calculator</Text>
      <Text style={styles.subtitle}>Estimate how long your cash lasts.</Text>
      <FormInput label="Current Savings" value={savings} onChange={setSavings} placeholder="e.g. 120000" />
      <FormInput label="Monthly Income" value={income} onChange={setIncome} placeholder="e.g. 50000" />
      <FormInput label="Monthly Expenses" value={expenses} onChange={setExpenses} placeholder="e.g. 58000" />
      <PrimaryButton title="Calculate Runway" onPress={calculate} />
      {runway !== null && (
        <View style={styles.result}>
          <Text style={styles.resultLabel}>RUNWAY</Text>
          <Text
            style={[
              styles.resultValue,
              {
                color:
                  runway === Infinity
                    ? colors.positive
                    : runway >= 12
                    ? colors.positive
                    : runway >= 6
                    ? colors.warning
                    : colors.negative,
              },
            ]}
          >
            {runway === Infinity ? "Stable ∞" : `${runway} months`}
          </Text>
          <Text style={styles.resultHint}>
            {runway === Infinity ? "You are cashflow positive." : "Based on current burn."}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radii.lg,
    gap: spacing.xs,
    ...shadows.card,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  result: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resultValue: {
    fontSize: fontSizes.xl,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  resultHint: {
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
