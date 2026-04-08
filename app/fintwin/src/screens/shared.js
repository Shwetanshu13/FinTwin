import { StyleSheet } from "react-native";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

export const sharedStyles = StyleSheet.create({
  /* ── Screen containers ── */
  screen: {
    flexGrow: 1,
    padding: spacing.xxl,
    justifyContent: "center",
    gap: spacing.lg,
    backgroundColor: colors.background,
  },

  /* ── Typography ── */
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  hint: {
    fontSize: fontSizes.sm,
    color: colors.textTertiary,
  },
  sectionTitle: {
    fontSize: fontSizes.xs,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: spacing.lg,
  },

  /* ── Inputs ── */
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    borderWidth: 0,
  },

  /* ── Primary button ── */
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
    justifyContent: "center",
    borderRadius: radii.md,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* ── Secondary button (ghost) ── */
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: "center",
    borderRadius: radii.md,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: "700",
  },

  /* ── Links ── */
  link: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: fontSizes.sm,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  /* ── Status messages ── */
  error: {
    color: colors.negative,
    backgroundColor: colors.negativeLt,
    fontSize: fontSizes.sm,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  success: {
    color: colors.positive,
    backgroundColor: colors.positiveLt,
    fontSize: fontSizes.sm,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    overflow: "hidden",
  },

  /* ── Chip selectors ── */
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md + 2,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: fontSizes.sm,
  },
});
