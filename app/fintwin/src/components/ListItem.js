import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radii, spacing } from "../../theme";

const CATEGORY_ICONS = {
  income: "💰",
  expense: "🧾",
  saving: "🏦",
  fixed: "📌",
  variable: "📊",
  emi: "📅",
  purchase: "🛒",
};

/**
 * Sleek list-item for income / expense / savings entries.
 *
 * @param {object}   props
 * @param {string}   props.title       - e.g. "Salary"
 * @param {string}   [props.subtitle]  - e.g. "2024-01-01 → 2024-12-31"
 * @param {number}   props.amount
 * @param {string}   [props.category]  - used to pick icon & color. "income"|"expense"|"saving"
 * @param {string}   [props.type]      - expense sub-type: "fixed"|"variable"|"emi"|"purchase"
 * @param {function} [props.onPress]
 */
export function ListItem({
  title,
  subtitle,
  amount,
  category = "income",
  type,
  onPress,
}) {
  const icon = type
    ? CATEGORY_ICONS[type] || CATEGORY_ICONS[category]
    : CATEGORY_ICONS[category];

  const amountColor =
    category === "expense" ? colors.negative : colors.positive;

  const prefix = category === "expense" ? "- " : "+ ";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && onPress && styles.pressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {prefix}₹{Number(amount || 0).toLocaleString("en-IN")}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  pressed: {
    backgroundColor: colors.divider,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
  },
  amount: {
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
});
