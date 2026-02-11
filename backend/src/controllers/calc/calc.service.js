import { calculateFinancialProfile } from "../../engine/profile.js";
import { calculateRunwayMonths } from "../../engine/runway.js";
import { emiPurchase, oneTimePurchase } from "../../engine/purchase.js";

export class CalcService {
    constructor(recordsRepo) {
        this.recordsRepo = recordsRepo;
    }

    _parseDate(dateString) {
        if (!dateString || typeof dateString !== "string") return null;
        const dt = new Date(dateString);
        return Number.isNaN(dt.getTime()) ? null : dt;
    }

    _monthsBetweenInclusive(startDate, endDate) {
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) return 0;
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;

        const startYear = startDate.getUTCFullYear();
        const startMonth = startDate.getUTCMonth();
        const endYear = endDate.getUTCFullYear();
        const endMonth = endDate.getUTCMonth();

        const monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
        const inclusive = monthDiff + 1;
        return inclusive < 0 ? 0 : inclusive;
    }

    async _buildEngineInputs(userId, asOfDateString) {
        const asOf = this._parseDate(asOfDateString) ?? new Date();

        const [incomeRows, expenseRows, savingsRows] = await Promise.all([
            this.recordsRepo.listIncome(userId),
            this.recordsRepo.listExpenses(userId),
            this.recordsRepo.listSavings(userId),
        ]);

        const existingSavings = (savingsRows ?? []).reduce(
            (sum, row) => sum + (Number(row.amount) || 0),
            0
        );

        const purchaseExpenses = (expenseRows ?? []).filter((e) => e.type === "purchase");
        const existingExpenses = purchaseExpenses.reduce(
            (sum, row) => sum + (Number(row.amount) || 0),
            0
        );

        const incomeWithDatesList = (incomeRows ?? []).map((row) => {
            const start = this._parseDate(row.startDate);
            const end = this._parseDate(row.endDate) ?? asOf;
            const months = this._monthsBetweenInclusive(start, end);
            return { amount: Number(row.amount) || 0, months };
        }).filter((x) => x.months > 0);

        const expensesWithDatesList = (expenseRows ?? [])
            .filter((row) => row.type !== "purchase")
            .map((row) => {
                const start = this._parseDate(row.startDate);
                const end = this._parseDate(row.endDate) ?? asOf;
                const months = this._monthsBetweenInclusive(start, end);
                return { amount: Number(row.amount) || 0, months };
            })
            .filter((x) => x.months > 0);

        return {
            existingSavings,
            existingExpenses,
            incomeWithDatesList,
            expensesWithDatesList,
        };
    }

    async calculateProfileFromDb(userId, options) {
        const inputs = await this._buildEngineInputs(userId, options?.asOfDate);
        return calculateFinancialProfile(
            inputs.existingSavings,
            inputs.existingExpenses,
            inputs.incomeWithDatesList,
            inputs.expensesWithDatesList
        );
    }

    async calculateRunwayFromDb(userId, options) {
        const profile = await this.calculateProfileFromDb(userId, options);
        return { runwayMonths: profile.runwayMonths };
    }

    async calculateSavingsFromDb(userId, options) {
        const profile = await this.calculateProfileFromDb(userId, options);

        return {
            finalSavings: profile.finalSavings,
            monthlyNetSavings: profile.monthlyNetSavings,
        };
    }

    async calculateOneTimePurchaseFromDb(userId, payload) {
        const inputs = await this._buildEngineInputs(userId, payload?.asOfDate);
        const purchaseAmount = Number(payload?.purchaseAmount) || 0;
        return oneTimePurchase(
            purchaseAmount,
            inputs.existingSavings,
            inputs.existingExpenses,
            inputs.incomeWithDatesList,
            inputs.expensesWithDatesList
        );
    }

    async calculateEmiPurchaseFromDb(userId, payload) {
        const inputs = await this._buildEngineInputs(userId, payload?.asOfDate);
        const emiAmount = Number(payload?.emiAmount) || 0;
        const emiTenureMonths = Number(payload?.emiTenureMonths) || 0;
        return emiPurchase(
            emiAmount,
            emiTenureMonths,
            inputs.existingSavings,
            inputs.existingExpenses,
            inputs.incomeWithDatesList,
            inputs.expensesWithDatesList
        );
    }
}
