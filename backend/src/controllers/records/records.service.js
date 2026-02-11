import { expenseTypeEnums } from "../../constants.js";

export class RecordsService {
    constructor(recordsRepo) {
        this.recordsRepo = recordsRepo;
    }

    _requireString(value, code) {
        if (typeof value !== "string" || !value.trim()) throw new Error(code);
        return value.trim();
    }

    _requireNumber(value, code) {
        const num = Number(value);
        if (!Number.isFinite(num)) throw new Error(code);
        return num;
    }

    _optionalDateString(value, code) {
        if (value == null) return null;
        if (typeof value !== "string" || !value) throw new Error(code);
        return value;
    }

    _requireDateString(value, code) {
        if (typeof value !== "string" || !value) throw new Error(code);
        return value;
    }

    async listIncome(userId) {
        return this.recordsRepo.listIncome(userId);
    }

    async createIncome(userId, payload) {
        this._requireString(payload?.title, "INVALID_INCOME_ITEM");
        this._requireNumber(payload?.amount, "INVALID_INCOME_ITEM");
        this._requireDateString(payload?.startDate, "INVALID_INCOME_ITEM");
        this._optionalDateString(payload?.endDate, "INVALID_INCOME_ITEM");

        return this.recordsRepo.createIncome(userId, payload);
    }

    async updateIncome(userId, id, payload) {
        const patch = {};
        if (payload?.title != null) patch.title = this._requireString(payload.title, "INVALID_INCOME_ITEM");
        if (payload?.amount != null) patch.amount = this._requireNumber(payload.amount, "INVALID_INCOME_ITEM");
        if (payload?.startDate != null) patch.startDate = this._requireDateString(payload.startDate, "INVALID_INCOME_ITEM");
        if (payload?.endDate !== undefined) patch.endDate = this._optionalDateString(payload.endDate, "INVALID_INCOME_ITEM");

        if (Object.keys(patch).length === 0) throw new Error("EMPTY_PATCH");

        const updated = await this.recordsRepo.updateIncome(userId, id, patch);
        if (!updated) throw new Error("NOT_FOUND");
        return updated;
    }

    async deleteIncome(userId, id) {
        const deleted = await this.recordsRepo.deleteIncome(userId, id);
        if (!deleted) throw new Error("NOT_FOUND");
        return deleted;
    }

    async listExpenses(userId) {
        return this.recordsRepo.listExpenses(userId);
    }

    async createExpense(userId, payload) {
        this._requireString(payload?.title, "INVALID_EXPENSE_ITEM");
        this._requireNumber(payload?.amount, "INVALID_EXPENSE_ITEM");
        this._requireDateString(payload?.startDate, "INVALID_EXPENSE_ITEM");
        this._optionalDateString(payload?.endDate, "INVALID_EXPENSE_ITEM");

        const type = this._requireString(payload?.type, "INVALID_EXPENSE_ITEM");
        if (!expenseTypeEnums.includes(type)) throw new Error("INVALID_EXPENSE_TYPE");

        return this.recordsRepo.createExpense(userId, payload);
    }

    async updateExpense(userId, id, payload) {
        const patch = {};
        if (payload?.title != null) patch.title = this._requireString(payload.title, "INVALID_EXPENSE_ITEM");
        if (payload?.amount != null) patch.amount = this._requireNumber(payload.amount, "INVALID_EXPENSE_ITEM");
        if (payload?.startDate != null) patch.startDate = this._requireDateString(payload.startDate, "INVALID_EXPENSE_ITEM");
        if (payload?.endDate !== undefined) patch.endDate = this._optionalDateString(payload.endDate, "INVALID_EXPENSE_ITEM");
        if (payload?.type != null) {
            const type = this._requireString(payload.type, "INVALID_EXPENSE_ITEM");
            if (!expenseTypeEnums.includes(type)) throw new Error("INVALID_EXPENSE_TYPE");
            patch.type = type;
        }

        if (Object.keys(patch).length === 0) throw new Error("EMPTY_PATCH");

        const updated = await this.recordsRepo.updateExpense(userId, id, patch);
        if (!updated) throw new Error("NOT_FOUND");
        return updated;
    }

    async deleteExpense(userId, id) {
        const deleted = await this.recordsRepo.deleteExpense(userId, id);
        if (!deleted) throw new Error("NOT_FOUND");
        return deleted;
    }

    async listSavings(userId) {
        return this.recordsRepo.listSavings(userId);
    }

    async createSaving(userId, payload) {
        this._requireString(payload?.title, "INVALID_SAVINGS_ITEM");
        this._requireNumber(payload?.amount, "INVALID_SAVINGS_ITEM");
        this._requireDateString(payload?.creditDate, "INVALID_SAVINGS_ITEM");

        return this.recordsRepo.createSaving(userId, payload);
    }

    async updateSaving(userId, id, payload) {
        const patch = {};
        if (payload?.title != null) patch.title = this._requireString(payload.title, "INVALID_SAVINGS_ITEM");
        if (payload?.amount != null) patch.amount = this._requireNumber(payload.amount, "INVALID_SAVINGS_ITEM");
        if (payload?.creditDate != null) patch.creditDate = this._requireDateString(payload.creditDate, "INVALID_SAVINGS_ITEM");

        if (Object.keys(patch).length === 0) throw new Error("EMPTY_PATCH");

        const updated = await this.recordsRepo.updateSaving(userId, id, patch);
        if (!updated) throw new Error("NOT_FOUND");
        return updated;
    }

    async deleteSaving(userId, id) {
        const deleted = await this.recordsRepo.deleteSaving(userId, id);
        if (!deleted) throw new Error("NOT_FOUND");
        return deleted;
    }
}
