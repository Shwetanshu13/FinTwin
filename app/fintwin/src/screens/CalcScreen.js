import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
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

import colors from "../../theme";

function toNumberOrUndefined(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return undefined;
    const num = Number(raw);
    return Number.isFinite(num) ? num : undefined;
}

function JsonOutput({ data }) {
    if (!data) return null;
    return (
        <View style={styles.outputBox}>
            <Text style={styles.outputText}>{JSON.stringify(data, null, 2)}</Text>
        </View>
    );
}

function DecisionSummary({ decision }) {
    if (!decision?.decisionStatement) return null;

    return (
        <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Decision</Text>
            <Text style={styles.summaryText}>{decision.decisionStatement}</Text>
            {Array.isArray(decision.keyPoints) && decision.keyPoints.length ? (
                <View style={styles.keyPoints}>
                    {decision.keyPoints.map((p, idx) => (
                        <Text key={`kp-${idx}`} style={styles.keyPointText}>
                            - {p}
                        </Text>
                    ))}
                </View>
            ) : null}
            {decision.model ? (
                <Text style={styles.summaryMeta}>Model: {decision.model}</Text>
            ) : null}
        </View>
    );
}

export function CalcScreen({ authResult, onGoHome }) {
    const [asOfDate, setAsOfDate] = useState("");
    const [purchaseAmount, setPurchaseAmount] = useState("");
    const [emiAmount, setEmiAmount] = useState("");
    const [emiTenureMonths, setEmiTenureMonths] = useState("");

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

    const signedInAs = authResult?.user?.fullName || authResult?.user?.username || authResult?.userId;

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
                <View style={styles.headerCard}>
                    <Text style={sharedStyles.title}>Calculations</Text>
                    <Text style={sharedStyles.hint}>
                        Signed in as {signedInAs}. Optional as-of date uses YYYY-MM-DD.
                    </Text>

                    <View style={styles.topActions}>
                        <Pressable style={sharedStyles.secondaryButton} onPress={onGoHome} disabled={loading}>
                            <Text style={sharedStyles.secondaryButtonText}>Home</Text>
                        </Pressable>
                    </View>
                </View>

                {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
                {loading ? <Text style={sharedStyles.hint}>Running...</Text> : null}

                <Text style={sharedStyles.sectionTitle}>Common</Text>
                <TextInput
                    value={asOfDate}
                    onChangeText={setAsOfDate}
                    placeholder="As of date (optional, YYYY-MM-DD)"
                    autoCapitalize="none"
                    style={sharedStyles.input}
                    editable={!loading}
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />

                <Text style={sharedStyles.sectionTitle}>Profile</Text>
                <Pressable
                    style={sharedStyles.button}
                    onPress={() => run(() => calcProfile(commonOptions))}
                    disabled={loading}
                >
                    <Text style={sharedStyles.buttonText}>Calculate profile</Text>
                </Pressable>

                <Text style={sharedStyles.sectionTitle}>Runway</Text>
                <Pressable
                    style={sharedStyles.button}
                    onPress={() => run(() => calcRunway(commonOptions))}
                    disabled={loading}
                >
                    <Text style={sharedStyles.buttonText}>Calculate runway</Text>
                </Pressable>

                <Text style={sharedStyles.sectionTitle}>Savings</Text>
                <Pressable
                    style={sharedStyles.button}
                    onPress={() => run(() => calcSavings(commonOptions))}
                    disabled={loading}
                >
                    <Text style={sharedStyles.buttonText}>Calculate savings</Text>
                </Pressable>

                <Text style={sharedStyles.sectionTitle}>One-time purchase</Text>
                <TextInput
                    value={purchaseAmount}
                    onChangeText={setPurchaseAmount}
                    placeholder="Purchase amount"
                    keyboardType="numeric"
                    style={sharedStyles.input}
                    editable={!loading}
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />
                <Pressable
                    style={sharedStyles.button}
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
                    <Text style={sharedStyles.buttonText}>Calculate one-time purchase</Text>
                </Pressable>

                <Text style={sharedStyles.sectionTitle}>EMI purchase</Text>
                <TextInput
                    value={emiAmount}
                    onChangeText={setEmiAmount}
                    placeholder="EMI amount (monthly)"
                    keyboardType="numeric"
                    style={sharedStyles.input}
                    editable={!loading}
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />
                <TextInput
                    value={emiTenureMonths}
                    onChangeText={setEmiTenureMonths}
                    placeholder="EMI tenure (months)"
                    keyboardType="numeric"
                    style={sharedStyles.input}
                    editable={!loading}
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />
                <Pressable
                    style={sharedStyles.button}
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
                    <Text style={sharedStyles.buttonText}>Calculate EMI purchase</Text>
                </Pressable>

                <Text style={sharedStyles.sectionTitle}>Output</Text>
                <Text style={sharedStyles.hint}>
                    The backend may include a Gemini `decision` object.
                </Text>
                <DecisionSummary decision={result?.decision} />
                <JsonOutput data={result} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = {
    scroll: {
        backgroundColor: colors.light,
    },
    container: {
        padding: 20,
        paddingBottom: 32,
        gap: 12,
        backgroundColor: colors.light,
    },
    headerCard: {
        borderWidth: 1,
        borderColor: "rgba(34, 40, 49, 0.12)",
        borderRadius: 16,
        padding: 14,
        gap: 6,
        backgroundColor: colors.white,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 1,
            },
        }),
    },
    topActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 6,
    },
    outputBox: {
        borderWidth: 1,
        borderColor: "rgba(34, 40, 49, 0.12)",
        borderRadius: 16,
        padding: 12,
        backgroundColor: colors.white,
    },
    outputText: {
        fontFamily: "monospace",
        fontSize: 12,
        color: colors.dark,
    },
    summaryBox: {
        borderWidth: 1,
        borderColor: "rgba(34, 40, 49, 0.12)",
        borderRadius: 16,
        padding: 12,
        backgroundColor: colors.white,
        gap: 6,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.dark,
    },
    summaryText: {
        color: colors.dark,
        lineHeight: 20,
    },
    summaryMeta: {
        color: "rgba(34, 40, 49, 0.72)",
        fontSize: 12,
        marginTop: 4,
    },
    keyPoints: {
        marginTop: 4,
        gap: 2,
    },
    keyPointText: {
        color: colors.dark,
        lineHeight: 20,
    },
};
