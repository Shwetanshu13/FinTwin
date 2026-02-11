import { requestJsonAuthed } from "./http";

export async function listIncome() {
    return requestJsonAuthed("/records/income");
}

export async function createIncome(payload) {
    return requestJsonAuthed("/records/income", { method: "POST", body: payload });
}

export async function updateIncome(id, patch) {
    return requestJsonAuthed(`/records/income/${id}`, { method: "PATCH", body: patch });
}

export async function deleteIncome(id) {
    return requestJsonAuthed(`/records/income/${id}`, { method: "DELETE" });
}

export async function listExpenses() {
    return requestJsonAuthed("/records/expenses");
}

export async function createExpense(payload) {
    return requestJsonAuthed("/records/expenses", { method: "POST", body: payload });
}

export async function updateExpense(id, patch) {
    return requestJsonAuthed(`/records/expenses/${id}`, { method: "PATCH", body: patch });
}

export async function deleteExpense(id) {
    return requestJsonAuthed(`/records/expenses/${id}`, { method: "DELETE" });
}

export async function listSavings() {
    return requestJsonAuthed("/records/savings");
}

export async function createSaving(payload) {
    return requestJsonAuthed("/records/savings", { method: "POST", body: payload });
}

export async function updateSaving(id, patch) {
    return requestJsonAuthed(`/records/savings/${id}`, { method: "PATCH", body: patch });
}

export async function deleteSaving(id) {
    return requestJsonAuthed(`/records/savings/${id}`, { method: "DELETE" });
}
