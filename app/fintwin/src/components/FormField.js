import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, fontSizes, radii, spacing } from "../../theme";

/**
 * Premium form field with uppercase label and gray-fill input.
 *
 * @param {object}  props
 * @param {string}  props.label
 * @param {string}  props.value
 * @param {function} props.onChangeText
 * @param {string}  [props.placeholder]
 * @param {string}  [props.keyboardType]
 * @param {boolean} [props.secureTextEntry]
 * @param {boolean} [props.editable]
 * @param {string}  [props.autoCapitalize]
 * @param {boolean} [props.autoCorrect]
 * @param {string}  [props.returnKeyType]
 * @param {string}  [props.error]
 */
export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  editable = true,
  autoCapitalize,
  autoCorrect,
  returnKeyType,
  error,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={editable}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        returnKeyType={returnKeyType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs + 2,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.negative,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colors.negative,
    fontWeight: "500",
  },
});
