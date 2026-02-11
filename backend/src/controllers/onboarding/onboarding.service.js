export class OnboardingService {
    constructor(onboardingRepo) {
        this.onboardingRepo = onboardingRepo;
    }

    _validateSavingsList(list) {
        if (!list) return [];
        if (!Array.isArray(list)) throw new Error("INVALID_SAVINGS_LIST");

        for (const item of list) {
            if (typeof item?.title !== "string" || !item.title.trim()) {
                throw new Error("INVALID_SAVINGS_ITEM");
            }
            if (!Number.isFinite(Number(item.amount))) {
                throw new Error("INVALID_SAVINGS_ITEM");
            }
            if (typeof item.creditDate !== "string" || !item.creditDate) {
                throw new Error("INVALID_SAVINGS_ITEM");
            }
        }

        return list;
    }

    _validateIncomeList(list) {
        if (!list) return [];
        if (!Array.isArray(list)) throw new Error("INVALID_INCOME_LIST");

        for (const item of list) {
            if (typeof item?.title !== "string" || !item.title.trim()) {
                throw new Error("INVALID_INCOME_ITEM");
            }
            if (!Number.isFinite(Number(item.amount))) {
                throw new Error("INVALID_INCOME_ITEM");
            }
            if (typeof item.startDate !== "string" || !item.startDate) {
                throw new Error("INVALID_INCOME_ITEM");
            }
            if (item.endDate != null && typeof item.endDate !== "string") {
                throw new Error("INVALID_INCOME_ITEM");
            }
        }

        return list;
    }

    _validateExpensesList(list) {
        if (!list) return [];
        if (!Array.isArray(list)) throw new Error("INVALID_EXPENSES_LIST");

        for (const item of list) {
            if (typeof item?.title !== "string" || !item.title.trim()) {
                throw new Error("INVALID_EXPENSE_ITEM");
            }
            if (!Number.isFinite(Number(item.amount))) {
                throw new Error("INVALID_EXPENSE_ITEM");
            }
            if (typeof item.type !== "string" || !item.type) {
                throw new Error("INVALID_EXPENSE_ITEM");
            }
            if (typeof item.startDate !== "string" || !item.startDate) {
                throw new Error("INVALID_EXPENSE_ITEM");
            }
            if (item.endDate != null && typeof item.endDate !== "string") {
                throw new Error("INVALID_EXPENSE_ITEM");
            }
        }

        return list;
    }

    async submitOnboarding(userId, payload) {
        const userDetails = payload?.user ?? {};

        const savings = this._validateSavingsList(payload?.savings);
        const income = this._validateIncomeList(payload?.income);
        const expenses = this._validateExpensesList(payload?.expenses);

        return this.onboardingRepo.withTransaction(async (tx) => {
            const updatedUser = await this.onboardingRepo.updateUserDetails(
                tx,
                userId,
                userDetails
            );

            const insertedSavings = await this.onboardingRepo.insertSavings(
                tx,
                userId,
                savings
            );
            const insertedIncome = await this.onboardingRepo.insertIncome(tx, userId, income);
            const insertedExpenses = await this.onboardingRepo.insertExpenses(
                tx,
                userId,
                expenses
            );

            return {
                user: updatedUser ?? null,
                savings: insertedSavings,
                income: insertedIncome,
                expenses: insertedExpenses,
            };
        });
    }
}
