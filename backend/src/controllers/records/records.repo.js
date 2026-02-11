import { and, eq } from "drizzle-orm";
import { db, expensesTable, incomeTable, savingsTable } from "../../db/index.js";

export class RecordsRepository {
    async listIncome(userId) {
        return db.select().from(incomeTable).where(eq(incomeTable.userId, userId));
    }

    async createIncome(userId, payload) {
        const [row] = await db
            .insert(incomeTable)
            .values({
                userId,
                amount: Number(payload.amount),
                title: String(payload.title),
                startDate: payload.startDate,
                endDate: payload.endDate ?? null,
            })
            .returning();

        return row;
    }

    async updateIncome(userId, id, patch) {
        const [row] = await db
            .update(incomeTable)
            .set(patch)
            .where(and(eq(incomeTable.id, id), eq(incomeTable.userId, userId)))
            .returning();

        return row ?? null;
    }

    async deleteIncome(userId, id) {
        const [row] = await db
            .delete(incomeTable)
            .where(and(eq(incomeTable.id, id), eq(incomeTable.userId, userId)))
            .returning();

        return row ?? null;
    }

    async listExpenses(userId) {
        return db.select().from(expensesTable).where(eq(expensesTable.userId, userId));
    }

    async createExpense(userId, payload) {
        const [row] = await db
            .insert(expensesTable)
            .values({
                userId,
                amount: Number(payload.amount),
                title: String(payload.title),
                type: payload.type,
                startDate: payload.startDate,
                endDate: payload.endDate ?? null,
            })
            .returning();

        return row;
    }

    async updateExpense(userId, id, patch) {
        const [row] = await db
            .update(expensesTable)
            .set(patch)
            .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, userId)))
            .returning();

        return row ?? null;
    }

    async deleteExpense(userId, id) {
        const [row] = await db
            .delete(expensesTable)
            .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, userId)))
            .returning();

        return row ?? null;
    }

    async listSavings(userId) {
        return db.select().from(savingsTable).where(eq(savingsTable.userId, userId));
    }

    async createSaving(userId, payload) {
        const [row] = await db
            .insert(savingsTable)
            .values({
                userId,
                amount: Number(payload.amount),
                title: String(payload.title),
                creditDate: payload.creditDate,
            })
            .returning();

        return row;
    }

    async updateSaving(userId, id, patch) {
        const [row] = await db
            .update(savingsTable)
            .set(patch)
            .where(and(eq(savingsTable.id, id), eq(savingsTable.userId, userId)))
            .returning();

        return row ?? null;
    }

    async deleteSaving(userId, id) {
        const [row] = await db
            .delete(savingsTable)
            .where(and(eq(savingsTable.id, id), eq(savingsTable.userId, userId)))
            .returning();

        return row ?? null;
    }
}
