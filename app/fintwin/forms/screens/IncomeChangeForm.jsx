import { View, Text, StyleSheet } from "react-native";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";
import { useState } from "react";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";

export default function IncomeChangeForm({ type }) {
  const [amount, setAmount] = useState("");
  const [startMonth, setStartMonth] = useState("");

  const submit = () => {
    const payload = {
      type, // INCREASE or DECREASE
      amount: Number(amount),
      startMonth: Number(startMonth),
    };
    console.log(payload);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Income Change</Text>
      <Text style={styles.subtitle}>Plan a {type === "INCREASE" ? "raise" : "reduction"} in income.</Text>
      <FormInput label="Amount Change" value={amount} onChange={setAmount} placeholder="e.g. 5000" />
      <FormInput label="Start Month" value={startMonth} onChange={setStartMonth} placeholder="e.g. 3" />
      <PrimaryButton title={`Apply ${type}`} onPress={submit} />
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
});
