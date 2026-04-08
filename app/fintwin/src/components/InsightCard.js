import { StyleSheet, Text, View } from "react-native";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

/**
 * Premium AI insight card that replaces the raw DecisionSummary.
 *
 * @param {object}  props
 * @param {object}  props.decision - { decisionStatement, keyPoints[], model }
 */
export function InsightCard({ decision }) {
  if (!decision?.decisionStatement) return null;

  // Remove the "Decision: " prefix if the backend prepends it
  const statement = decision.decisionStatement.replace(/^Decision:\s*/i, "");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sparkle}>✨</Text>
        <Text style={styles.headerText}>AI Financial Insight</Text>
      </View>

      <Text style={styles.statement}>{statement}</Text>

      {Array.isArray(decision.keyPoints) && decision.keyPoints.length > 0 ? (
        <View style={styles.points}>
          {decision.keyPoints.map((point, idx) => (
            <View key={`kp-${idx}`} style={styles.pointRow}>
              <View style={styles.bullet} />
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {decision.model ? (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by {decision.model}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(13, 148, 136, 0.15)",
    ...shadows.subtle,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sparkle: {
    fontSize: 20,
  },
  headerText: {
    fontSize: fontSizes.md,
    fontWeight: "800",
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  statement: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    lineHeight: 24,
    fontWeight: "500",
  },
  points: {
    gap: spacing.sm,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  pointText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(13, 148, 136, 0.12)",
    paddingTop: spacing.md,
  },
  footerText: {
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
