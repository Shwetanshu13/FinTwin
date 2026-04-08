import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    calcEmiPurchase,
    calcOneTimePurchase,
    calcProfile,
    calcRunway,
    calcSavings,
} from "../api/calc";
import { sharedStyles } from "./shared";

import { FormField } from "../components/FormField";
import { FeatureCard } from "../components/FeatureCard";
import { StatCard } from "../components/StatCard";
import { RunwayGauge } from "../components/RunwayGauge";
import { InsightCard } from "../components/InsightCard";

import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

function toNumberOrUndefined(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return undefined;
    const num = Number(raw);
    return Number.isFinite(num) ? num : undefined;
}

function formatCurrency(v) {
    if (v == null || v === 0) return "—";
    return `₹${Number(v).toLocaleString("en-IN")}`;
}

/* ── Affordability Badge ── */
function AffordabilityBadge({ affordable }) {
    if (affordable == null) return null;
    const yes = Boolean(affordable);
    return (
        <View
            style={[
                resultStyles.badge,
                { backgroundColor: yes ? colors.positiveLt : colors.negativeLt },
            ]}
        >
            <Text style={resultStyles.badgeIcon}>{yes ? "✅" : "⚠️"}</Text>
            <Text
                style={[
                    resultStyles.badgeText,
                    { color: yes ? colors.positive : colors.negative },
                ]}
            >
                {yes ? "Affordable" : "Not Affordable"}
            </Text>
        </View>
    );
}

/* ═══════════ RESULTS PANEL ═══════════ */
function ResultsPanel({ data }) {
    if (!data) return null;

    const {
        totalIncome,
        totalVariableExpenses,
        totalMonthlyIncome,
        totalMonthlyExpense,
        finalSavings,
        runwayMonths,
        monthlyNetSavings,
        affordability,
        increasedMonthlyExpenses,
        decreasedMonthlySavings,
        decision,
    } = data;

    const hasRunway = runwayMonths != null && runwayMonths > 0;
    const displayIncome = totalIncome ?? totalMonthlyIncome;
    const displayExpense = totalVariableExpenses ?? totalMonthlyExpense;

    return (
        <View style={resultStyles.container}>
            {/* Section label */}
            <Text style={resultStyles.sectionLabel}>RESULTS</Text>

            {/* Affordability badge (for purchase calculations) */}
            <AffordabilityBadge affordable={affordability} />

            {/* Runway hero gauge */}
            {hasRunway ? (
                <RunwayGauge months={runwayMonths} />
            ) : null}

            {/* Stat cards grid */}
            <View style={resultStyles.statsGrid}>
                {displayIncome != null ? (
                    <StatCard
                        icon="💰"
                        label="Total Income"
                        value={formatCurrency(displayIncome)}
                        accentColor={colors.positive}
                    />
                ) : null}
                {displayExpense != null ? (
                    <StatCard
                        icon="🧾"
                        label="Total Expenses"
                        value={formatCurrency(displayExpense)}
                        accentColor={colors.negative}
                    />
                ) : null}
            </View>

            <View style={resultStyles.statsGrid}>
                {finalSavings != null ? (
                    <StatCard
                        icon="🏦"
                        label="Final Savings"
                        value={formatCurrency(finalSavings)}
                        accentColor={
                            finalSavings >= 0 ? colors.positive : colors.negative
                        }
                    />
                ) : null}
                {monthlyNetSavings != null ? (
                    <StatCard
                        icon="📈"
                        label="Monthly Net"
                        value={formatCurrency(monthlyNetSavings)}
                        accentColor={
                            monthlyNetSavings >= 0 ? colors.positive : colors.negative
                        }
                    />
                ) : null}
            </View>

            {/* EMI-specific extra stats */}
            {(increasedMonthlyExpenses != null || decreasedMonthlySavings != null) ? (
                <View style={resultStyles.statsGrid}>
                    {increasedMonthlyExpenses != null ? (
                        <StatCard
                            icon="📊"
                            label="New Expenses"
                            value={formatCurrency(increasedMonthlyExpenses)}
                            accentColor={colors.warning}
                            subtitle="After EMI"
                        />
                    ) : null}
                    {decreasedMonthlySavings != null ? (
                        <StatCard
                            icon="📉"
                            label="New Savings"
                            value={formatCurrency(decreasedMonthlySavings)}
                            accentColor={colors.warning}
                            subtitle="After EMI"
                        />
                    ) : null}
                </View>
            ) : null}

            {/* AI Insight */}
            <InsightCard decision={decision} />
        </View>
    );
}

/* ═══════════ MAIN CALC SCREEN ═══════════ */
export function CalcScreen({ authResult, onGoHome }) {
    const [asOfDate, setAsOfDate] = useState("");
    const [purchaseAmount, setPurchaseAmount] = useState("");
    const [emiAmount, setEmiAmount] = useState("");
    const [emiTenureMonths, setEmiTenureMonths] = useState("");

    const [expandedCard, setExpandedCard] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const commonOptions = useMemo(
        () => ({ asOfDate: asOfDate.trim() ? asOfDate.trim() : undefined }),
        [asOfDate]
    );

    async function run(fn) {
        setError(null);
        setResult(null);
        setLoading(true);
        try {
            const data = await fn();
            setResult(data);
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentInsetAdjustmentBehavior="always"
            >
                {/* ── Header ── */}
                <View style={styles.header}>
                    <Text style={styles.title}>Calculations</Text>
                    <Text style={styles.subtitle}>
                        Analyze your financial future
                    </Text>
                </View>

                {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

                {/* ── As-of date ── */}
                <View style={styles.dateFieldWrap}>
                    <FormField
                        label="As of Date (optional)"
                        value={asOfDate}
                        onChangeText={setAsOfDate}
                        placeholder="YYYY-MM-DD"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                </View>

                {/* ── Feature Cards ── */}
                <Text style={sharedStyles.sectionTitle}>Analyses</Text>
                <View style={styles.cardsGap}>
                    <FeatureCard
                        icon="📊"
                        title="Financial Profile"
                        subtitle="Full snapshot of income, expenses & savings"
                        onPress={() => run(() => calcProfile(commonOptions))}
                        disabled={loading}
                    />
                    <FeatureCard
                        icon="🛫"
                        title="Runway Analysis"
                        subtitle="How long your savings will last"
                        onPress={() => run(() => calcRunway(commonOptions))}
                        disabled={loading}
                    />
                    <FeatureCard
                        icon="💰"
                        title="Savings Summary"
                        subtitle="Your current savings position"
                        onPress={() => run(() => calcSavings(commonOptions))}
                        disabled={loading}
                    />
                </View>

                <Text style={sharedStyles.sectionTitle}>Scenarios</Text>
                <View style={styles.cardsGap}>
                    <FeatureCard
                        icon="🛒"
                        title="One-time Purchase"
                        subtitle="Impact of a single large expense"
                        onPress={() => {
                            if (expandedCard === "purchase") {
                                run(() =>
                                    calcOneTimePurchase({
                                        ...commonOptions,
                                        purchaseAmount: toNumberOrUndefined(purchaseAmount),
                                    })
                                );
                            } else {
                                setExpandedCard("purchase");
                            }
                        }}
                        disabled={loading}
                        expanded={expandedCard === "purchase"}
                    >
                        <FormField
                            label="Purchase Amount"
                            value={purchaseAmount}
                            onChangeText={setPurchaseAmount}
                            placeholder="e.g. 50000"
                            keyboardType="numeric"
                            editable={!loading}
                        />
                        <Pressable
                            style={({ pressed }) => [
                                sharedStyles.button,
                                pressed && { opacity: 0.85 },
                            ]}
                            onPress={() =>
                                run(() =>
                                    calcOneTimePurchase({
                                        ...commonOptions,
                                        purchaseAmount: toNumberOrUndefined(purchaseAmount),
                                    })
                                )
                            }
                            disabled={loading}
                        >
                            <Text style={sharedStyles.buttonText}>
                                Calculate Impact
                            </Text>
                        </Pressable>
                    </FeatureCard>

                    <FeatureCard
                        icon="📅"
                        title="EMI Purchase"
                        subtitle="Spread payments over months"
                        onPress={() => {
                            if (expandedCard === "emi") {
                                run(() =>
                                    calcEmiPurchase({
                                        ...commonOptions,
                                        emiAmount: toNumberOrUndefined(emiAmount),
                                        emiTenureMonths: toNumberOrUndefined(emiTenureMonths),
                                    })
                                );
                            } else {
                                setExpandedCard("emi");
                            }
                        }}
                        disabled={loading}
                        expanded={expandedCard === "emi"}
                    >
                        <FormField
                            label="EMI Amount (monthly)"
                            value={emiAmount}
                            onChangeText={setEmiAmount}
                            placeholder="e.g. 5000"
                            keyboardType="numeric"
                            editable={!loading}
                        />
                        <FormField
                            label="Tenure (months)"
                            value={emiTenureMonths}
                            onChangeText={setEmiTenureMonths}
                            placeholder="e.g. 12"
                            keyboardType="numeric"
                            editable={!loading}
                        />
                        <Pressable
                            style={({ pressed }) => [
                                sharedStyles.button,
                                pressed && { opacity: 0.85 },
                            ]}
                            onPress={() =>
                                run(() =>
                                    calcEmiPurchase({
                                        ...commonOptions,
                                        emiAmount: toNumberOrUndefined(emiAmount),
                                        emiTenureMonths: toNumberOrUndefined(emiTenureMonths),
                                    })
                                )
                            }
                            disabled={loading}
                        >
                            <Text style={sharedStyles.buttonText}>
                                Calculate EMI Impact
                            </Text>
                        </Pressable>
                    </FeatureCard>
                </View>

                {/* ── Loading indicator ── */}
                {loading ? (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Analyzing…</Text>
                    </View>
                ) : null}

                {/* ── Results ── */}
                <ResultsPanel data={result} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

/* ── Main screen styles ── */
const styles = StyleSheet.create({
    scroll: {
        backgroundColor: colors.background,
    },
    container: {
        padding: spacing.xxl,
        paddingBottom: spacing.xxxl + 16,
        gap: spacing.md,
        backgroundColor: colors.background,
    },
    header: {
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: fontSizes.xxl + 4,
        fontWeight: "900",
        color: colors.textPrimary,
        letterSpacing: -0.8,
    },
    subtitle: {
        fontSize: fontSizes.sm,
        color: colors.textTertiary,
    },
    dateFieldWrap: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.lg,
        ...shadows.subtle,
    },
    cardsGap: {
        gap: spacing.sm,
    },
    loadingWrap: {
        alignItems: "center",
        paddingVertical: spacing.xxxl,
        gap: spacing.md,
    },
    loadingText: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        fontWeight: "600",
    },
});

/* ── Result panel styles ── */
const resultStyles = StyleSheet.create({
    container: {
        gap: spacing.lg,
        marginTop: spacing.lg,
    },
    sectionLabel: {
        fontSize: fontSizes.xs,
        fontWeight: "800",
        color: colors.textTertiary,
        textTransform: "uppercase",
        letterSpacing: 2,
        textAlign: "center",
    },
    statsGrid: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    badge: {
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.pill,
    },
    badgeIcon: {
        fontSize: 16,
    },
    badgeText: {
        fontSize: fontSizes.md,
        fontWeight: "800",
    },
});
