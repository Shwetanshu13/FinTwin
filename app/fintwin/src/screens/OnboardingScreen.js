import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { submitOnboarding } from "../api/onboarding";
import { sharedStyles } from "./shared";

const EXPENSE_TYPES = ["fixed", "variable", "emi", "purchase"];

function optionalNumber(value) {
    const trimmed = String(value ?? "").trim();
    if (!trimmed) return undefined;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : undefined;
}

export function OnboardingScreen({ authResult, onLogout, onGoHome }) {
    const [fullName, setFullName] = useState(authResult?.user?.fullName || "");
    const [phone, setPhone] = useState(authResult?.user?.phone || "");

    const [incomeTitle, setIncomeTitle] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [incomeStartDate, setIncomeStartDate] = useState("");
    const [incomeEndDate, setIncomeEndDate] = useState("");

    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseType, setExpenseType] = useState("fixed");
    const [expenseStartDate, setExpenseStartDate] = useState("");
    const [expenseEndDate, setExpenseEndDate] = useState("");

    const [savingTitle, setSavingTitle] = useState("");
    const [savingAmount, setSavingAmount] = useState("");
    const [savingCreditDate, setSavingCreditDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const payload = useMemo(() => {
        const user = {
            fullName: fullName.trim() || undefined,
            phone: phone.trim() || "",
        };

        const income = [];
        if (incomeTitle.trim() && optionalNumber(incomeAmount) != null && incomeStartDate.trim()) {
            income.push({
                title: incomeTitle.trim(),
                amount: optionalNumber(incomeAmount),
                startDate: incomeStartDate.trim(),
                endDate: incomeEndDate.trim() ? incomeEndDate.trim() : null,
            });
        }

        const expenses = [];
        if (
            expenseTitle.trim() &&
            optionalNumber(expenseAmount) != null &&
            expenseStartDate.trim() &&
            expenseType
        ) {
            expenses.push({
                title: expenseTitle.trim(),
                amount: optionalNumber(expenseAmount),
                type: expenseType,
                startDate: expenseStartDate.trim(),
                endDate: expenseEndDate.trim() ? expenseEndDate.trim() : null,
            });
        }

        const savings = [];
        if (savingTitle.trim() && optionalNumber(savingAmount) != null && savingCreditDate.trim()) {
            savings.push({
                title: savingTitle.trim(),
                amount: optionalNumber(savingAmount),
                creditDate: savingCreditDate.trim(),
            });
        }

        return { user, income, expenses, savings };
    }, [
        fullName,
        phone,
        incomeTitle,
        incomeAmount,
        incomeStartDate,
        incomeEndDate,
        expenseTitle,
        expenseAmount,
        expenseType,
        expenseStartDate,
        expenseEndDate,
        savingTitle,
        savingAmount,
        savingCreditDate,
    ]);

    async function onSubmit() {
        setError(null);
        setSuccess(false);
        setLoading(true);
        try {
            await submitOnboarding(payload);
            setSuccess(true);
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={sharedStyles.title}>Onboarding</Text>
            <Text style={sharedStyles.hint}>Dates use YYYY-MM-DD.</Text>

            {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
            {success ? <Text style={sharedStyles.success}>Saved.</Text> : null}

            <Text style={sharedStyles.sectionTitle}>Your details</Text>
            <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full name"
                autoCapitalize="words"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone (optional)"
                keyboardType="phone-pad"
                style={sharedStyles.input}
                editable={!loading}
            />

            <Text style={sharedStyles.sectionTitle}>Income (optional)</Text>
            <TextInput
                value={incomeTitle}
                onChangeText={setIncomeTitle}
                placeholder="Title (e.g. Salary)"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={incomeAmount}
                onChangeText={setIncomeAmount}
                placeholder="Amount"
                keyboardType="numeric"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={incomeStartDate}
                onChangeText={setIncomeStartDate}
                placeholder="Start date (YYYY-MM-DD)"
                autoCapitalize="none"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={incomeEndDate}
                onChangeText={setIncomeEndDate}
                placeholder="End date (optional)"
                autoCapitalize="none"
                style={sharedStyles.input}
                editable={!loading}
            />

            <Text style={sharedStyles.sectionTitle}>Expense (optional)</Text>
            <TextInput
                value={expenseTitle}
                onChangeText={setExpenseTitle}
                placeholder="Title (e.g. Rent)"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                placeholder="Amount"
                keyboardType="numeric"
                style={sharedStyles.input}
                editable={!loading}
            />
            <Text style={sharedStyles.hint}>Type</Text>
            <View style={sharedStyles.row}>
                {EXPENSE_TYPES.map((t) => (
                    <Pressable
                        key={t}
                        onPress={() => setExpenseType(t)}
                        disabled={loading}
                        style={[
                            sharedStyles.chip,
                            expenseType === t ? sharedStyles.chipActive : null,
                        ]}
                    >
                        <Text style={sharedStyles.chipText}>{t}</Text>
                    </Pressable>
                ))}
            </View>
            <TextInput
                value={expenseStartDate}
                onChangeText={setExpenseStartDate}
                placeholder="Start date (YYYY-MM-DD)"
                autoCapitalize="none"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={expenseEndDate}
                onChangeText={setExpenseEndDate}
                placeholder="End date (optional)"
                autoCapitalize="none"
                style={sharedStyles.input}
                editable={!loading}
            />

            <Text style={sharedStyles.sectionTitle}>Savings (optional)</Text>
            <TextInput
                value={savingTitle}
                onChangeText={setSavingTitle}
                placeholder="Title (e.g. Emergency fund)"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={savingAmount}
                onChangeText={setSavingAmount}
                placeholder="Amount"
                keyboardType="numeric"
                style={sharedStyles.input}
                editable={!loading}
            />
            <TextInput
                value={savingCreditDate}
                onChangeText={setSavingCreditDate}
                placeholder="Credit date (YYYY-MM-DD)"
                autoCapitalize="none"
                style={sharedStyles.input}
                editable={!loading}
            />

            <Pressable style={sharedStyles.button} onPress={onSubmit} disabled={loading}>
                <Text style={sharedStyles.buttonText}>
                    {loading ? "Saving..." : "Save onboarding"}
                </Text>
            </Pressable>

            <Pressable
                style={sharedStyles.secondaryButton}
                onPress={onGoHome}
                disabled={loading}
            >
                <Text style={sharedStyles.secondaryButtonText}>Go to Home</Text>
            </Pressable>

            <Pressable style={sharedStyles.secondaryButton} onPress={onLogout} disabled={loading}>
                <Text style={sharedStyles.secondaryButtonText}>Log out</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = {
    container: {
        padding: 20,
        gap: 12,
    },
};
