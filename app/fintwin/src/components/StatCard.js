import { StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

/**
 * A premium stat card used on the CalcScreen results area.
 *
 * @param {object}  props
 * @param {string}  props.label  - e.g. "Total Income"
 * @param {string}  props.value  - formatted value e.g. "₹1,50,000"
 * @param {string}  [props.subtitle] - optional sub-text
 * @param {string}  [props.accentColor] - left strip & value color
 * @param {string}  [props.icon] - emoji icon
 */
export function StatCard({
  label,
  value,
  subtitle,
  accentColor = colors.primary,
  icon,
}) {
  return (
    <View style={[styles.container, { borderLeftColor: accentColor }]}>
      <View style={styles.header}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    minWidth: 140,
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: {
    fontSize: fontSizes.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
