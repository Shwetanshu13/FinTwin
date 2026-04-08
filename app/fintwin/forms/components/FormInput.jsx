import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, fontSizes, radii, spacing } from "../../theme";

export default function FormInput({ label, value, onChange, placeholder, keyboardType = "numeric", secureTextEntry = false }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: radii.md,
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    borderWidth: 0,
  },
});
