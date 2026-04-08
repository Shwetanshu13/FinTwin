import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

/**
 * Circular gauge for runway months — the hero metric.
 *
 * @param {object}  props
 * @param {number}  props.months - runway months
 * @param {number}  [props.maxMonths=24] - max months for full arc
 */
export function RunwayGauge({ months, maxMonths = 24 }) {
  const displayMonths = Math.round(months * 10) / 10;
  const fraction = Math.min(months / maxMonths, 1);

  // Color coding
  let gaugeColor = colors.positive;     // >12 months
  let bgTint = colors.positiveLt;
  if (months < 6) {
    gaugeColor = colors.negative;
    bgTint = colors.negativeLt;
  } else if (months < 12) {
    gaugeColor = colors.warning;
    bgTint = colors.warningLt;
  }

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - fraction);

  return (
    <View style={[styles.container, { backgroundColor: bgTint }]}>
      <View style={styles.gaugeWrap}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Filled arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.centerLabel}>
          <Text style={[styles.monthNumber, { color: gaugeColor }]}>
            {displayMonths}
          </Text>
          <Text style={styles.monthWord}>months</Text>
        </View>
      </View>
      <Text style={styles.title}>Financial Runway</Text>
      <Text style={styles.subtitle}>
        {months >= 12
          ? "You're in a healthy position"
          : months >= 6
          ? "Consider building more reserves"
          : "Your runway is critically low"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.positiveLt,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: "center",
    ...shadows.card,
  },
  gaugeWrap: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  svg: {
    position: "absolute",
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  monthNumber: {
    fontSize: fontSizes.hero,
    fontWeight: "900",
    color: colors.positive,
  },
  monthWord: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
