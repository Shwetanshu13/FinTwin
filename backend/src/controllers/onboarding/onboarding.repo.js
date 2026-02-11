import { eq } from "drizzle-orm";
import {
    db,
    expensesTable,
    incomeTable,
    savingsTable,
    usersTable,
} from "../../db/index.js";

export class OnboardingRepository {
    async withTransaction(callback) {
        return db.transaction(async (tx) => callback(tx));
    }

    async updateUserDetails(tx, userId, details) {
        const patch = {};
        if (typeof details.fullName === "string" && details.fullName.trim()) {
            patch.fullName = details.fullName.trim();
        }
        if (typeof details.phone === "string") {
            patch.phone = details.phone.trim() || null;
        }

        if (Object.keys(patch).length === 0) return null;

        const [updated] = await tx
            .update(usersTable)
            .set(patch)
            .where(eq(usersTable.id, userId))
            .returning();

        return updated ?? null;
    }

    async insertSavings(tx, userId, savingsList) {
        if (!savingsList?.length) return [];

        const rows = savingsList.map((item) => ({
            userId,
            amount: Number(item.amount),
            title: String(item.title),
            creditDate: item.creditDate,
        }));

        return tx.insert(savingsTable).values(rows).returning();
    }

    async insertIncome(tx, userId, incomeList) {
        if (!incomeList?.length) return [];

        const rows = incomeList.map((item) => ({
            userId,
            amount: Number(item.amount),
            title: String(item.title),
            startDate: item.startDate,
            endDate: item.endDate ?? null,
        }));

        return tx.insert(incomeTable).values(rows).returning();
    }

    async insertExpenses(tx, userId, expensesList) {
        if (!expensesList?.length) return [];

        const rows = expensesList.map((item) => ({
            userId,
            amount: Number(item.amount),
            title: String(item.title),
            type: item.type,
            startDate: item.startDate,
            endDate: item.endDate ?? null,
        }));

        return tx.insert(expensesTable).values(rows).returning();
    }
}
