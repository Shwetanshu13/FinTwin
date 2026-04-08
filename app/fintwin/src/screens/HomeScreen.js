import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    createExpense,
    createIncome,
    createSaving,
    deleteExpense,
    deleteIncome,
    deleteSaving,
    listExpenses,
    listIncome,
    listSavings,
    updateExpense,
    updateIncome,
    updateSaving,
} from "../api/records";
import { sharedStyles } from "./shared";
import { FormField } from "../components/FormField";
import { ListItem } from "../components/ListItem";

import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

const EXPENSE_TYPES = ["fixed", "variable", "emi", "purchase"];

function toNumberOrUndefined(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return undefined;
    const num = Number(raw);
    return Number.isFinite(num) ? num : undefined;
}

function formatCurrency(v) {
    return `₹${Number(v || 0).toLocaleString("en-IN")}`;
}

/* ── Inline edit action row ── */
function RowActions({ onSave, onCancel, onDelete, saving }) {
    return (
        <View style={styles.rowActions}>
            <Pressable
                style={({ pressed }) => [
                    styles.saveBtn,
                    pressed && { opacity: 0.85 },
                ]}
                onPress={onSave}
                disabled={saving}
            >
                <Text style={styles.saveBtnText}>
                    {saving ? "Saving…" : "Save"}
                </Text>
            </Pressable>
            <View style={styles.rowActionsSecondary}>
                <Pressable
                    style={({ pressed }) => [
                        styles.ghostBtn,
                        pressed && { opacity: 0.7 },
                    ]}
                    onPress={onCancel}
                    disabled={saving}
                >
                    <Text style={styles.ghostBtnText}>Cancel</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.dangerBtn,
                        pressed && { opacity: 0.7 },
                    ]}
                    onPress={onDelete}
                    disabled={saving}
                >
                    <Text style={styles.dangerBtnText}>Delete</Text>
                </Pressable>
            </View>
        </View>
    );
}

/* ── Quick summary mini card ── */
function MiniStat({ label, value, color }) {
    return (
        <View style={styles.miniStat}>
            <Text style={styles.miniStatLabel}>{label}</Text>
            <Text style={[styles.miniStatValue, { color }]}>{value}</Text>
        </View>
    );
}

export function HomeScreen({ authResult, onGoCalc, onGoProfile }) {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [savings, setSavings] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newIncome, setNewIncome] = useState({ title: "", amount: "", startDate: "", endDate: "" });
    const [newExpense, setNewExpense] = useState({ title: "", amount: "", type: "fixed", startDate: "", endDate: "" });
    const [newSaving, setNewSaving] = useState({ title: "", amount: "", creditDate: "" });

    const [showAddIncome, setShowAddIncome] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddSaving, setShowAddSaving] = useState(false);

    const [editing, setEditing] = useState(null);
    const [editDraft, setEditDraft] = useState({});
    const [savingEdit, setSavingEdit] = useState(false);

    const canLoad = useMemo(
        () => Boolean(authResult?.token?.accessToken),
        [authResult?.token?.accessToken]
    );

    /* ── Computed summaries ── */
    const totalIncome = useMemo(
        () => income.reduce((s, i) => s + (Number(i.amount) || 0), 0),
        [income]
    );
    const totalExpenses = useMemo(
        () => expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0),
        [expenses]
    );
    const totalSavings = useMemo(
        () => savings.reduce((s, sv) => s + (Number(sv.amount) || 0), 0),
        [savings]
    );

    async function loadAll() {
        setError(null);
        setLoading(true);
        try {
            const [inc, exp, sav] = await Promise.all([
                listIncome(),
                listExpenses(),
                listSavings(),
            ]);
            setIncome(inc?.income || []);
            setExpenses(exp?.expenses || []);
            setSavings(sav?.savings || []);
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (canLoad) loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canLoad]);

    function startEdit(kind, item) {
        setEditing({ kind, id: item.id });
        setEditDraft({ ...item });
        setError(null);
    }

    function cancelEdit() {
        setEditing(null);
        setEditDraft({});
        setSavingEdit(false);
    }

    async function saveEdit() {
        if (!editing) return;
        setError(null);
        setSavingEdit(true);
        try {
            if (editing.kind === "income") {
                const patch = {
                    title: editDraft.title,
                    amount: toNumberOrUndefined(editDraft.amount) ?? editDraft.amount,
                    startDate: editDraft.startDate,
                    endDate: editDraft.endDate === "" ? null : editDraft.endDate,
                };
                const res = await updateIncome(editing.id, patch);
                const updated = res?.income;
                setIncome((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            }
            if (editing.kind === "expenses") {
                const patch = {
                    title: editDraft.title,
                    amount: toNumberOrUndefined(editDraft.amount) ?? editDraft.amount,
                    type: editDraft.type,
                    startDate: editDraft.startDate,
                    endDate: editDraft.endDate === "" ? null : editDraft.endDate,
                };
                const res = await updateExpense(editing.id, patch);
                const updated = res?.expense;
                setExpenses((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            }
            if (editing.kind === "savings") {
                const patch = {
                    title: editDraft.title,
                    amount: toNumberOrUndefined(editDraft.amount) ?? editDraft.amount,
                    creditDate: editDraft.creditDate,
                };
                const res = await updateSaving(editing.id, patch);
                const updated = res?.saving;
                setSavings((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            }

            cancelEdit();
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
            setSavingEdit(false);
        }
    }

    async function removeEditing() {
        if (!editing) return;
        setError(null);
        setSavingEdit(true);
        try {
            if (editing.kind === "income") {
                await deleteIncome(editing.id);
                setIncome((prev) => prev.filter((x) => x.id !== editing.id));
            }
            if (editing.kind === "expenses") {
                await deleteExpense(editing.id);
                setExpenses((prev) => prev.filter((x) => x.id !== editing.id));
            }
            if (editing.kind === "savings") {
                await deleteSaving(editing.id);
                setSavings((prev) => prev.filter((x) => x.id !== editing.id));
            }
            cancelEdit();
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
            setSavingEdit(false);
        }
    }

    async function addIncome() {
        setError(null);
        try {
            const payload = {
                title: newIncome.title.trim(),
                amount: toNumberOrUndefined(newIncome.amount),
                startDate: newIncome.startDate.trim(),
                endDate: newIncome.endDate.trim() ? newIncome.endDate.trim() : null,
            };
            const res = await createIncome(payload);
            if (res?.income) setIncome((prev) => [res.income, ...prev]);
            setNewIncome({ title: "", amount: "", startDate: "", endDate: "" });
            setShowAddIncome(false);
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        }
    }

    async function addExpense() {
        setError(null);
        try {
            const payload = {
                title: newExpense.title.trim(),
                amount: toNumberOrUndefined(newExpense.amount),
                type: newExpense.type,
                startDate: newExpense.startDate.trim(),
                endDate: newExpense.endDate.trim() ? newExpense.endDate.trim() : null,
            };
            const res = await createExpense(payload);
            if (res?.expense) setExpenses((prev) => [res.expense, ...prev]);
            setNewExpense({ title: "", amount: "", type: "fixed", startDate: "", endDate: "" });
            setShowAddExpense(false);
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        }
    }

    async function addSaving() {
        setError(null);
        try {
            const payload = {
                title: newSaving.title.trim(),
                amount: toNumberOrUndefined(newSaving.amount),
                creditDate: newSaving.creditDate.trim(),
            };
            const res = await createSaving(payload);
            if (res?.saving) setSavings((prev) => [res.saving, ...prev]);
            setNewSaving({ title: "", amount: "", creditDate: "" });
            setShowAddSaving(false);
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        }
    }

    const signedInAs =
        authResult?.user?.fullName || authResult?.user?.username || authResult?.userId;

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
                    <Text style={styles.greeting}>
                        Hello, {signedInAs?.split(" ")[0] || "there"} 👋
                    </Text>
                    <Text style={styles.title}>FinTwin</Text>
                </View>

                {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={colors.primary}
                        style={{ marginVertical: spacing.lg }}
                    />
                ) : null}

                {/* ── Quick Summary ── */}
                <View style={styles.summaryRow}>
                    <MiniStat
                        label="Income"
                        value={formatCurrency(totalIncome)}
                        color={colors.positive}
                    />
                    <MiniStat
                        label="Expenses"
                        value={formatCurrency(totalExpenses)}
                        color={colors.negative}
                    />
                    <MiniStat
                        label="Savings"
                        value={formatCurrency(totalSavings)}
                        color={colors.primary}
                    />
                </View>

                {/* ══════════ INCOME SECTION ══════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={sharedStyles.sectionTitle}>Income</Text>
                    <Pressable
                        style={styles.addPill}
                        onPress={() => setShowAddIncome(!showAddIncome)}
                    >
                        <Text style={styles.addPillText}>
                            {showAddIncome ? "✕" : "+ Add"}
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.card}>
                    {showAddIncome && (
                        <View style={styles.addForm}>
                            <FormField label="Title" value={newIncome.title} onChangeText={(v) => setNewIncome((p) => ({ ...p, title: v }))} placeholder="e.g. Salary" />
                            <FormField label="Amount" value={newIncome.amount} onChangeText={(v) => setNewIncome((p) => ({ ...p, amount: v }))} placeholder="e.g. 50000" keyboardType="numeric" />
                            <FormField label="Start Date" value={newIncome.startDate} onChangeText={(v) => setNewIncome((p) => ({ ...p, startDate: v }))} placeholder="YYYY-MM-DD" autoCapitalize="none" />
                            <FormField label="End Date (optional)" value={newIncome.endDate} onChangeText={(v) => setNewIncome((p) => ({ ...p, endDate: v }))} placeholder="YYYY-MM-DD" autoCapitalize="none" />
                            <Pressable style={({ pressed }) => [sharedStyles.button, pressed && { opacity: 0.85 }]} onPress={addIncome}>
                                <Text style={sharedStyles.buttonText}>Add Income</Text>
                            </Pressable>
                        </View>
                    )}
                    {income.length === 0 && !showAddIncome ? (
                        <Text style={styles.emptyText}>No income entries yet</Text>
                    ) : null}
                    {income.map((item) => {
                        const isEditing = editing?.kind === "income" && editing?.id === item.id;
                        if (isEditing) {
                            return (
                                <View key={`income-${item.id}`} style={styles.editCard}>
                                    <Text style={styles.editTitle}>Edit Income</Text>
                                    <FormField label="Title" value={String(editDraft.title ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, title: v }))} placeholder="Title" editable={!savingEdit} />
                                    <FormField label="Amount" value={String(editDraft.amount ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, amount: v }))} placeholder="Amount" keyboardType="numeric" editable={!savingEdit} />
                                    <FormField label="Start Date" value={String(editDraft.startDate ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, startDate: v }))} placeholder="Start date" autoCapitalize="none" editable={!savingEdit} />
                                    <FormField label="End Date" value={editDraft.endDate == null ? "" : String(editDraft.endDate)} onChangeText={(v) => setEditDraft((p) => ({ ...p, endDate: v }))} placeholder="End date (optional)" autoCapitalize="none" editable={!savingEdit} />
                                    <RowActions saving={savingEdit} onSave={saveEdit} onCancel={cancelEdit} onDelete={removeEditing} />
                                </View>
                            );
                        }
                        return (
                            <ListItem
                                key={`income-${item.id}`}
                                title={item.title}
                                subtitle={`${item.startDate} → ${item.endDate || "ongoing"}`}
                                amount={item.amount}
                                category="income"
                                onPress={() => startEdit("income", item)}
                            />
                        );
                    })}
                </View>

                {/* ══════════ EXPENSES SECTION ══════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={sharedStyles.sectionTitle}>Expenses</Text>
                    <Pressable
                        style={styles.addPill}
                        onPress={() => setShowAddExpense(!showAddExpense)}
                    >
                        <Text style={styles.addPillText}>
                            {showAddExpense ? "✕" : "+ Add"}
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.card}>
                    {showAddExpense && (
                        <View style={styles.addForm}>
                            <FormField label="Title" value={newExpense.title} onChangeText={(v) => setNewExpense((p) => ({ ...p, title: v }))} placeholder="e.g. Rent" />
                            <FormField label="Amount" value={newExpense.amount} onChangeText={(v) => setNewExpense((p) => ({ ...p, amount: v }))} placeholder="e.g. 15000" keyboardType="numeric" />
                            <Text style={styles.chipLabel}>TYPE</Text>
                            <View style={sharedStyles.row}>
                                {EXPENSE_TYPES.map((t) => (
                                    <Pressable
                                        key={`new-exp-${t}`}
                                        onPress={() => setNewExpense((p) => ({ ...p, type: t }))}
                                        style={[sharedStyles.chip, newExpense.type === t ? sharedStyles.chipActive : null]}
                                    >
                                        <Text style={sharedStyles.chipText}>{t}</Text>
                                    </Pressable>
                                ))}
                            </View>
                            <FormField label="Start Date" value={newExpense.startDate} onChangeText={(v) => setNewExpense((p) => ({ ...p, startDate: v }))} placeholder="YYYY-MM-DD" autoCapitalize="none" />
                            <FormField label="End Date (optional)" value={newExpense.endDate} onChangeText={(v) => setNewExpense((p) => ({ ...p, endDate: v }))} placeholder="YYYY-MM-DD" autoCapitalize="none" />
                            <Pressable style={({ pressed }) => [sharedStyles.button, pressed && { opacity: 0.85 }]} onPress={addExpense}>
                                <Text style={sharedStyles.buttonText}>Add Expense</Text>
                            </Pressable>
                        </View>
                    )}
                    {expenses.length === 0 && !showAddExpense ? (
                        <Text style={styles.emptyText}>No expense entries yet</Text>
                    ) : null}
                    {expenses.map((item) => {
                        const isEditing = editing?.kind === "expenses" && editing?.id === item.id;
                        if (isEditing) {
                            return (
                                <View key={`expense-${item.id}`} style={styles.editCard}>
                                    <Text style={styles.editTitle}>Edit Expense</Text>
                                    <FormField label="Title" value={String(editDraft.title ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, title: v }))} placeholder="Title" editable={!savingEdit} />
                                    <FormField label="Amount" value={String(editDraft.amount ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, amount: v }))} placeholder="Amount" keyboardType="numeric" editable={!savingEdit} />
                                    <Text style={styles.chipLabel}>TYPE</Text>
                                    <View style={sharedStyles.row}>
                                        {EXPENSE_TYPES.map((t) => (
                                            <Pressable
                                                key={`edit-exp-${item.id}-${t}`}
                                                onPress={() => setEditDraft((p) => ({ ...p, type: t }))}
                                                disabled={savingEdit}
                                                style={[sharedStyles.chip, editDraft.type === t ? sharedStyles.chipActive : null]}
                                            >
                                                <Text style={sharedStyles.chipText}>{t}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                    <FormField label="Start Date" value={String(editDraft.startDate ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, startDate: v }))} placeholder="Start date" autoCapitalize="none" editable={!savingEdit} />
                                    <FormField label="End Date" value={editDraft.endDate == null ? "" : String(editDraft.endDate)} onChangeText={(v) => setEditDraft((p) => ({ ...p, endDate: v }))} placeholder="End date (optional)" autoCapitalize="none" editable={!savingEdit} />
                                    <RowActions saving={savingEdit} onSave={saveEdit} onCancel={cancelEdit} onDelete={removeEditing} />
                                </View>
                            );
                        }
                        return (
                            <ListItem
                                key={`expense-${item.id}`}
                                title={item.title}
                                subtitle={`${item.type} · ${item.startDate} → ${item.endDate || "ongoing"}`}
                                amount={item.amount}
                                category="expense"
                                type={item.type}
                                onPress={() => startEdit("expenses", item)}
                            />
                        );
                    })}
                </View>

                {/* ══════════ SAVINGS SECTION ══════════ */}
                <View style={styles.sectionHeader}>
                    <Text style={sharedStyles.sectionTitle}>Savings</Text>
                    <Pressable
                        style={styles.addPill}
                        onPress={() => setShowAddSaving(!showAddSaving)}
                    >
                        <Text style={styles.addPillText}>
                            {showAddSaving ? "✕" : "+ Add"}
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.card}>
                    {showAddSaving && (
                        <View style={styles.addForm}>
                            <FormField label="Title" value={newSaving.title} onChangeText={(v) => setNewSaving((p) => ({ ...p, title: v }))} placeholder="e.g. Emergency Fund" />
                            <FormField label="Amount" value={newSaving.amount} onChangeText={(v) => setNewSaving((p) => ({ ...p, amount: v }))} placeholder="e.g. 100000" keyboardType="numeric" />
                            <FormField label="Credit Date" value={newSaving.creditDate} onChangeText={(v) => setNewSaving((p) => ({ ...p, creditDate: v }))} placeholder="YYYY-MM-DD" autoCapitalize="none" />
                            <Pressable style={({ pressed }) => [sharedStyles.button, pressed && { opacity: 0.85 }]} onPress={addSaving}>
                                <Text style={sharedStyles.buttonText}>Add Saving</Text>
                            </Pressable>
                        </View>
                    )}
                    {savings.length === 0 && !showAddSaving ? (
                        <Text style={styles.emptyText}>No savings entries yet</Text>
                    ) : null}
                    {savings.map((item) => {
                        const isEditing = editing?.kind === "savings" && editing?.id === item.id;
                        if (isEditing) {
                            return (
                                <View key={`saving-${item.id}`} style={styles.editCard}>
                                    <Text style={styles.editTitle}>Edit Saving</Text>
                                    <FormField label="Title" value={String(editDraft.title ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, title: v }))} placeholder="Title" editable={!savingEdit} />
                                    <FormField label="Amount" value={String(editDraft.amount ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, amount: v }))} placeholder="Amount" keyboardType="numeric" editable={!savingEdit} />
                                    <FormField label="Credit Date" value={String(editDraft.creditDate ?? "")} onChangeText={(v) => setEditDraft((p) => ({ ...p, creditDate: v }))} placeholder="Credit date" autoCapitalize="none" editable={!savingEdit} />
                                    <RowActions saving={savingEdit} onSave={saveEdit} onCancel={cancelEdit} onDelete={removeEditing} />
                                </View>
                            );
                        }
                        return (
                            <ListItem
                                key={`saving-${item.id}`}
                                title={item.title}
                                subtitle={`Credit: ${item.creditDate}`}
                                amount={item.amount}
                                category="saving"
                                onPress={() => startEdit("savings", item)}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        marginTop: 20,
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
    greeting: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        fontWeight: "500",
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

    /* Summary row */
    summaryRow: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    miniStat: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        alignItems: "center",
        ...shadows.card,
    },
    miniStatLabel: {
        fontSize: fontSizes.xs,
        fontWeight: "700",
        color: colors.textTertiary,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: spacing.xs,
    },
    miniStatValue: {
        fontSize: fontSizes.md,
        fontWeight: "800",
    },

    /* Section header with add button */
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: spacing.sm,
    },
    addPill: {
        backgroundColor: colors.primaryLight,
        paddingVertical: spacing.xs + 2,
        paddingHorizontal: spacing.md,
        borderRadius: radii.pill,
    },
    addPillText: {
        fontSize: fontSizes.xs,
        fontWeight: "700",
        color: colors.primary,
    },

    /* Card wrapper */
    card: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        overflow: "hidden",
        ...shadows.card,
    },

    /* Add form inside card */
    addForm: {
        padding: spacing.lg,
        gap: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },

    /* Edit state */
    editCard: {
        padding: spacing.lg,
        gap: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        backgroundColor: colors.inputBg,
    },
    editTitle: {
        fontSize: fontSizes.sm,
        fontWeight: "800",
        color: colors.textPrimary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    chipLabel: {
        fontSize: fontSizes.xs,
        fontWeight: "700",
        color: colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 1,
    },

    /* Empty state */
    emptyText: {
        fontSize: fontSizes.sm,
        color: colors.textTertiary,
        textAlign: "center",
        paddingVertical: spacing.xxl,
    },

    /* Row actions */
    rowActions: {
        gap: spacing.sm,
    },
    saveBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 13,
        borderRadius: radii.md,
        alignItems: "center",
    },
    saveBtnText: {
        color: colors.white,
        fontSize: fontSizes.md,
        fontWeight: "700",
    },
    rowActionsSecondary: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    ghostBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: radii.md,
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    ghostBtnText: {
        color: colors.textSecondary,
        fontSize: fontSizes.sm,
        fontWeight: "600",
    },
    dangerBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: radii.md,
        alignItems: "center",
        backgroundColor: colors.negativeLt,
        borderWidth: 1.5,
        borderColor: colors.negative,
    },
    dangerBtnText: {
        color: colors.negative,
        fontSize: fontSizes.sm,
        fontWeight: "700",
    },
});
