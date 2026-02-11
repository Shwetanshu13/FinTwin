import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";

function mapRecordsError(error) {
    const code = error?.message || "UNKNOWN";

    switch (code) {
        case "INVALID_INCOME_ITEM":
        case "INVALID_EXPENSE_ITEM":
        case "INVALID_SAVINGS_ITEM":
        case "INVALID_EXPENSE_TYPE":
        case "EMPTY_PATCH":
            return { status: 400, body: { error: code } };
        case "NOT_FOUND":
            return { status: 404, body: { error: code } };
        default:
            return { status: 500, body: { error: "INTERNAL_SERVER_ERROR" } };
    }
}

export function createRecordsRouter({ recordsService, userRepo }) {
    const router = Router();

    router.get("/income", requireAuth(userRepo), async (req, res) => {
        try {
            const rows = await recordsService.listIncome(req.user.id);
            return res.status(200).json({ income: rows });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.post("/income", requireAuth(userRepo), async (req, res) => {
        try {
            const row = await recordsService.createIncome(req.user.id, req.body);
            return res.status(201).json({ income: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.patch("/income/:id", requireAuth(userRepo), async (req, res) => {
        try {
            const id = Number(req.params.id);
            const row = await recordsService.updateIncome(req.user.id, id, req.body);
            return res.status(200).json({ income: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.delete("/income/:id", requireAuth(userRepo), async (req, res) => {
        try {
            const id = Number(req.params.id);
            const row = await recordsService.deleteIncome(req.user.id, id);
            return res.status(200).json({ income: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.get("/expenses", requireAuth(userRepo), async (req, res) => {
        try {
            const rows = await recordsService.listExpenses(req.user.id);
            return res.status(200).json({ expenses: rows });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.post("/expenses", requireAuth(userRepo), async (req, res) => {
        try {
            const row = await recordsService.createExpense(req.user.id, req.body);
            return res.status(201).json({ expense: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.patch("/expenses/:id", requireAuth(userRepo), async (req, res) => {
        try {
            const id = Number(req.params.id);
            const row = await recordsService.updateExpense(req.user.id, id, req.body);
            return res.status(200).json({ expense: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.delete("/expenses/:id", requireAuth(userRepo), async (req, res) => {
        try {
            const id = Number(req.params.id);
            const row = await recordsService.deleteExpense(req.user.id, id);
            return res.status(200).json({ expense: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.get("/savings", requireAuth(userRepo), async (req, res) => {
        try {
            const rows = await recordsService.listSavings(req.user.id);
            return res.status(200).json({ savings: rows });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.post("/savings", requireAuth(userRepo), async (req, res) => {
        try {
            const row = await recordsService.createSaving(req.user.id, req.body);
            return res.status(201).json({ saving: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.patch("/savings/:id", requireAuth(userRepo), async (req, res) => {
        try {
            const id = Number(req.params.id);
            const row = await recordsService.updateSaving(req.user.id, id, req.body);
            return res.status(200).json({ saving: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.delete("/savings/:id", requireAuth(userRepo), async (req, res) => {
        try {
            const id = Number(req.params.id);
            const row = await recordsService.deleteSaving(req.user.id, id);
            return res.status(200).json({ saving: row });
        } catch (e) {
            const mapped = mapRecordsError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    return router;
}
