import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

const screenWidth = Dimensions.get("window").width;

const demoBalances = [
  12000, 11200, 10550, 9800, 9050, 8400, 7600, 6900, 6100, 5400, 4700, 3900,
];

export default function Dashboard() {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
      data: demoBalances,
      color: () => colors.primary,
      strokeWidth: 3,
    }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Savings</Text>
          <Text style={[styles.statValue, { color: colors.positive }]}>₹12,000</Text>
          <Text style={styles.statDelta}>+4.2% vs last month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Monthly Net</Text>
          <Text style={[styles.statValue, { color: colors.negative }]}>-₹800</Text>
          <Text style={styles.statDelta}>Burning cash</Text>
        </View>
      </View>

      <View style={styles.statCardWide}>
        <Text style={styles.statLabel}>Runway</Text>
        <Text style={[styles.statValue, { color: colors.warning }]}>14 months</Text>
        <Text style={styles.statDelta}>Based on current burn</Text>
      </View>

      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Cashflow Trend</Text>
      <View style={styles.chartCard}>
        <LineChart
          data={chartData}
          width={Math.min(screenWidth - 48, 380)}
          height={220}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: colors.surface,
            backgroundGradientTo: colors.surface,
            decimalPlaces: 0,
            color: () => colors.primary,
            labelColor: () => colors.textSecondary,
            propsForBackgroundLines: {
              stroke: colors.border,
            },
          }}
          style={styles.chart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.xs,
    fontWeight: "800",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionSpacing: {
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  statCardWide: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: fontSizes.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statDelta: {
    marginTop: 6,
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    ...shadows.card,
  },
  chart: {
    borderRadius: radii.md,
  },
});
