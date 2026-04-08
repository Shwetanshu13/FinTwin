import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

/**
 * Tappable feature card — replaces the block "Calculate" buttons.
 *
 * @param {object}   props
 * @param {string}   props.icon     - emoji icon
 * @param {string}   props.title    - e.g. "Financial Profile"
 * @param {string}   props.subtitle - short description
 * @param {function} props.onPress
 * @param {boolean}  [props.disabled]
 * @param {boolean}  [props.expanded] - if an input field is needed
 * @param {React.ReactNode} [props.children] - expandable content
 */
export function FeatureCard({
  icon,
  title,
  subtitle,
  onPress,
  disabled,
  expanded,
  children,
}) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      {expanded && children ? (
        <View style={styles.expandArea}>{children}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: "hidden",
    ...shadows.card,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: colors.divider,
  },
  disabled: {
    opacity: 0.5,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 24,
    fontWeight: "300",
    color: colors.textTertiary,
  },
  expandArea: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
