import { View, Text, StyleSheet } from "react-native";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";
import { useState } from "react";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";

export default function OneTimePurchaseForm() {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");

  const submit = () => {
    const payload = {
      type: "ONE_TIME",
      amount: Number(amount),
      month: Number(month),
    };
    console.log(payload);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>One-time Purchase</Text>
      <Text style={styles.subtitle}>Model a single large expense.</Text>
      <FormInput label="Purchase Amount" value={amount} onChange={setAmount} placeholder="e.g. 25000" />
      <FormInput label="Month (from now)" value={month} onChange={setMonth} placeholder="e.g. 2" />
      <PrimaryButton title="Add Purchase" onPress={submit} />
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
