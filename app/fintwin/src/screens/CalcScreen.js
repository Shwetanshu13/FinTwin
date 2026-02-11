import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import {
    calcEmiPurchase,
    calcOneTimePurchase,
    calcProfile,
    calcRunway,
    calcSavings,
} from "../api/calc";
import { sharedStyles } from "./shared";

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

export function CalcScreen({ authResult, onGoHome, onLogout }) {
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
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={sharedStyles.title}>Calculations</Text>
            <Text style={sharedStyles.hint}>
                Signed in as {signedInAs}. Optional as-of date uses YYYY-MM-DD.
            </Text>

            {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
            {loading ? <Text style={sharedStyles.hint}>Running...</Text> : null}

            <View style={styles.topActions}>
                <Pressable style={sharedStyles.secondaryButton} onPress={onGoHome} disabled={loading}>
                    <Text style={sharedStyles.secondaryButtonText}>Home</Text>
                </Pressable>
                <Pressable style={sharedStyles.secondaryButton} onPress={onLogout} disabled={loading}>
                    <Text style={sharedStyles.secondaryButtonText}>Log out</Text>
                </Pressable>
            </View>

            <Text style={sharedStyles.sectionTitle}>Common</Text>
            <TextInput
                value={asOfDate}
                onChangeText={setAsOfDate}
                placeholder="As of date (optional, YYYY-MM-DD)"
                autoCapitalize="none"
                style={sharedStyles.input}
                editable={!loading}
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
            />
            <TextInput
                value={emiTenureMonths}
                onChangeText={setEmiTenureMonths}
                placeholder="EMI tenure (months)"
                keyboardType="numeric"
                style={sharedStyles.input}
                editable={!loading}
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
    );
}

const styles = {
    container: {
        padding: 20,
        gap: 12,
    },
    topActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 4,
    },
    outputBox: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        backgroundColor: "#fafafa",
    },
    outputText: {
        fontFamily: "monospace",
        fontSize: 12,
        color: "#111",
    },
    summaryBox: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        backgroundColor: "#fff",
        gap: 6,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    summaryText: {
        color: "#111",
        lineHeight: 20,
    },
    summaryMeta: {
        color: "#444",
        fontSize: 12,
        marginTop: 4,
    },
    keyPoints: {
        marginTop: 4,
        gap: 2,
    },
    keyPointText: {
        color: "#111",
        lineHeight: 20,
    },
};
