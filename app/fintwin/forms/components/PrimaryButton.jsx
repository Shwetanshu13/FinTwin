import { Pressable, Text, StyleSheet } from "react-native";
import { colors, fontSizes, radii, spacing } from "../../theme";

export default function PrimaryButton({ title, onPress, variant = "primary" }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "700",
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  outlineText: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: fontSizes.md,
    letterSpacing: 0.3,
  },
});
