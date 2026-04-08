import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";

export default function EMIPurchaseForm() {
  const [emi, setEmi] = useState("");
  const [months, setMonths] = useState("");
  const [startMonth, setStartMonth] = useState("");

  const submit = () => {
    const payload = {
      type: "EMI",
      emi: Number(emi),
      durationMonths: Number(months),
      startMonth: Number(startMonth),
    };
    console.log(payload);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>EMI Purchase</Text>
      <Text style={styles.subtitle}>Spread payments across months.</Text>
      <FormInput label="Monthly EMI" value={emi} onChange={setEmi} placeholder="e.g. 3500" />
      <FormInput label="Duration (months)" value={months} onChange={setMonths} placeholder="e.g. 12" />
      <FormInput label="Start Month" value={startMonth} onChange={setStartMonth} placeholder="e.g. 1" />
      <PrimaryButton title="Add EMI" onPress={submit} />
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