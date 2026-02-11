import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

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

const EXPENSE_TYPES = ["fixed", "variable", "emi", "purchase"];

function toNumberOrUndefined(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return undefined;
    const num = Number(raw);
    return Number.isFinite(num) ? num : undefined;
}

function RowActions({ onSave, onCancel, onDelete, saving }) {
    return (
        <View style={styles.rowActions}>
            <Pressable style={sharedStyles.button} onPress={onSave} disabled={saving}>
                <Text style={sharedStyles.buttonText}>{saving ? "Saving..." : "Save"}</Text>
            </Pressable>
            <Pressable style={sharedStyles.secondaryButton} onPress={onCancel} disabled={saving}>
                <Text style={sharedStyles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={onDelete} disabled={saving}>
                <Text style={styles.dangerButtonText}>Delete</Text>
            </Pressable>
        </View>
    );
}

export function HomeScreen({ authResult, onLogout, onGoOnboarding, onGoCalc }) {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [savings, setSavings] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newIncome, setNewIncome] = useState({ title: "", amount: "", startDate: "", endDate: "" });
    const [newExpense, setNewExpense] = useState({ title: "", amount: "", type: "fixed", startDate: "", endDate: "" });
    const [newSaving, setNewSaving] = useState({ title: "", amount: "", creditDate: "" });

    const [editing, setEditing] = useState(null);
    const [editDraft, setEditDraft] = useState({});
    const [savingEdit, setSavingEdit] = useState(false);

    const canLoad = useMemo(
        () => Boolean(authResult?.token?.accessToken),
        [authResult?.token?.accessToken]
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
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={sharedStyles.title}>Home</Text>
            <Text style={sharedStyles.hint}>Manage your income, expenses, and savings.</Text>

            {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
            {loading ? <Text style={sharedStyles.hint}>Loading...</Text> : null}

            <View style={styles.topActions}>
                <Pressable style={sharedStyles.secondaryButton} onPress={onGoOnboarding} disabled={loading}>
                    <Text style={sharedStyles.secondaryButtonText}>Onboarding</Text>
                </Pressable>
                <Pressable style={sharedStyles.secondaryButton} onPress={onGoCalc} disabled={loading}>
                    <Text style={sharedStyles.secondaryButtonText}>Calculations</Text>
                </Pressable>
                <Pressable style={sharedStyles.secondaryButton} onPress={loadAll} disabled={loading}>
                    <Text style={sharedStyles.secondaryButtonText}>Refresh</Text>
                </Pressable>
                <Pressable style={sharedStyles.secondaryButton} onPress={onLogout} disabled={loading}>
                    <Text style={sharedStyles.secondaryButtonText}>Log out</Text>
                </Pressable>
            </View>

            <Text style={sharedStyles.sectionTitle}>Income</Text>
            <View style={styles.card}>
                <TextInput
                    value={newIncome.title}
                    onChangeText={(v) => setNewIncome((p) => ({ ...p, title: v }))}
                    placeholder="Title"
                    style={sharedStyles.input}
                />
                <TextInput
                    value={newIncome.amount}
                    onChangeText={(v) => setNewIncome((p) => ({ ...p, amount: v }))}
                    placeholder="Amount"
                    keyboardType="numeric"
                    style={sharedStyles.input}
                />
                <TextInput
                    value={newIncome.startDate}
                    onChangeText={(v) => setNewIncome((p) => ({ ...p, startDate: v }))}
                    placeholder="Start date (YYYY-MM-DD)"
                    autoCapitalize="none"
                    style={sharedStyles.input}
                />
                <TextInput
                    value={newIncome.endDate}
                    onChangeText={(v) => setNewIncome((p) => ({ ...p, endDate: v }))}
                    placeholder="End date (optional)"
                    autoCapitalize="none"
                    style={sharedStyles.input}
                />
                <Pressable style={sharedStyles.button} onPress={addIncome}>
                    <Text style={sharedStyles.buttonText}>Add income</Text>
                </Pressable>
            </View>

            {income.map((item) => {
                const isEditing = editing?.kind === "income" && editing?.id === item.id;
                return (
                    <View key={`income-${item.id}`} style={styles.card}>
                        {isEditing ? (
                            <>
                                <TextInput
                                    value={String(editDraft.title ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, title: v }))}
                                    placeholder="Title"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <TextInput
                                    value={String(editDraft.amount ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, amount: v }))}
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <TextInput
                                    value={String(editDraft.startDate ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, startDate: v }))}
                                    placeholder="Start date"
                                    autoCapitalize="none"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <TextInput
                                    value={editDraft.endDate == null ? "" : String(editDraft.endDate)}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, endDate: v }))}
                                    placeholder="End date (optional)"
                                    autoCapitalize="none"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <RowActions
                                    saving={savingEdit}
                                    onSave={saveEdit}
                                    onCancel={cancelEdit}
                                    onDelete={removeEditing}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemMeta}>Amount: {item.amount}</Text>
                                <Text style={styles.itemMeta}>
                                    {item.startDate} → {item.endDate || "(no end)"}
                                </Text>
                                <Pressable style={sharedStyles.secondaryButton} onPress={() => startEdit("income", item)}>
                                    <Text style={sharedStyles.secondaryButtonText}>Edit</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                );
            })}

            <Text style={sharedStyles.sectionTitle}>Expenses</Text>
            <View style={styles.card}>
                <TextInput
                    value={newExpense.title}
                    onChangeText={(v) => setNewExpense((p) => ({ ...p, title: v }))}
                    placeholder="Title"
                    style={sharedStyles.input}
                />
                <TextInput
                    value={newExpense.amount}
                    onChangeText={(v) => setNewExpense((p) => ({ ...p, amount: v }))}
                    placeholder="Amount"
                    keyboardType="numeric"
                    style={sharedStyles.input}
                />
                <Text style={sharedStyles.hint}>Type</Text>
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
                <TextInput
                    value={newExpense.startDate}
                    onChangeText={(v) => setNewExpense((p) => ({ ...p, startDate: v }))}
                    placeholder="Start date (YYYY-MM-DD)"
                    autoCapitalize="none"
                    style={sharedStyles.input}
                />
                <TextInput
                    value={newExpense.endDate}
                    onChangeText={(v) => setNewExpense((p) => ({ ...p, endDate: v }))}
                    placeholder="End date (optional)"
                    autoCapitalize="none"
                    style={sharedStyles.input}
                />
                <Pressable style={sharedStyles.button} onPress={addExpense}>
                    <Text style={sharedStyles.buttonText}>Add expense</Text>
                </Pressable>
            </View>

            {expenses.map((item) => {
                const isEditing = editing?.kind === "expenses" && editing?.id === item.id;
                return (
                    <View key={`expense-${item.id}`} style={styles.card}>
                        {isEditing ? (
                            <>
                                <TextInput
                                    value={String(editDraft.title ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, title: v }))}
                                    placeholder="Title"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <TextInput
                                    value={String(editDraft.amount ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, amount: v }))}
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <Text style={sharedStyles.hint}>Type</Text>
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
                                <TextInput
                                    value={String(editDraft.startDate ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, startDate: v }))}
                                    placeholder="Start date"
                                    autoCapitalize="none"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <TextInput
                                    value={editDraft.endDate == null ? "" : String(editDraft.endDate)}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, endDate: v }))}
                                    placeholder="End date (optional)"
                                    autoCapitalize="none"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <RowActions
                                    saving={savingEdit}
                                    onSave={saveEdit}
                                    onCancel={cancelEdit}
                                    onDelete={removeEditing}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemMeta}>Amount: {item.amount}</Text>
                                <Text style={styles.itemMeta}>Type: {item.type}</Text>
                                <Text style={styles.itemMeta}>
                                    {item.startDate} → {item.endDate || "(no end)"}
                                </Text>
                                <Pressable style={sharedStyles.secondaryButton} onPress={() => startEdit("expenses", item)}>
                                    <Text style={sharedStyles.secondaryButtonText}>Edit</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                );
            })}

            <Text style={sharedStyles.sectionTitle}>Savings</Text>
            <View style={styles.card}>
                <TextInput
                    value={newSaving.title}
                    onChangeText={(v) => setNewSaving((p) => ({ ...p, title: v }))}
                    placeholder="Title"
                    style={sharedStyles.input}
                />
                <TextInput
                    value={newSaving.amount}
                    onChangeText={(v) => setNewSaving((p) => ({ ...p, amount: v }))}
                    placeholder="Amount"
                    keyboardType="numeric"
                    style={sharedStyles.input}
                />
                <TextInput
                    value={newSaving.creditDate}
                    onChangeText={(v) => setNewSaving((p) => ({ ...p, creditDate: v }))}
                    placeholder="Credit date (YYYY-MM-DD)"
                    autoCapitalize="none"
                    style={sharedStyles.input}
                />
                <Pressable style={sharedStyles.button} onPress={addSaving}>
                    <Text style={sharedStyles.buttonText}>Add saving</Text>
                </Pressable>
            </View>

            {savings.map((item) => {
                const isEditing = editing?.kind === "savings" && editing?.id === item.id;
                return (
                    <View key={`saving-${item.id}`} style={styles.card}>
                        {isEditing ? (
                            <>
                                <TextInput
                                    value={String(editDraft.title ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, title: v }))}
                                    placeholder="Title"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <TextInput
                                    value={String(editDraft.amount ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, amount: v }))}
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <TextInput
                                    value={String(editDraft.creditDate ?? "")}
                                    onChangeText={(v) => setEditDraft((p) => ({ ...p, creditDate: v }))}
                                    placeholder="Credit date"
                                    autoCapitalize="none"
                                    style={sharedStyles.input}
                                    editable={!savingEdit}
                                />
                                <RowActions
                                    saving={savingEdit}
                                    onSave={saveEdit}
                                    onCancel={cancelEdit}
                                    onDelete={removeEditing}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemMeta}>Amount: {item.amount}</Text>
                                <Text style={styles.itemMeta}>Credit: {item.creditDate}</Text>
                                <Pressable style={sharedStyles.secondaryButton} onPress={() => startEdit("savings", item)}>
                                    <Text style={sharedStyles.secondaryButtonText}>Edit</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                );
            })}
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
    card: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 12,
        gap: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    itemMeta: {
        color: "#444",
    },
    rowActions: {
        gap: 8,
    },
    dangerButton: {
        borderWidth: 1,
        borderColor: "#b00020",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    dangerButtonText: {
        color: "#b00020",
        fontSize: 16,
        fontWeight: "600",
    },
};
