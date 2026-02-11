import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";

function mapOnboardingError(error) {
    const code = error?.message || "UNKNOWN";

    switch (code) {
        case "INVALID_SAVINGS_LIST":
        case "INVALID_SAVINGS_ITEM":
        case "INVALID_INCOME_LIST":
        case "INVALID_INCOME_ITEM":
        case "INVALID_EXPENSES_LIST":
        case "INVALID_EXPENSE_ITEM":
            return { status: 400, body: { error: code } };
        default:
            return { status: 500, body: { error: "INTERNAL_SERVER_ERROR" } };
    }
}

export function createOnboardingRouter({ onboardingService, userRepo }) {
    const router = Router();

    router.post("/", requireAuth(userRepo), async (req, res) => {
        try {
            const userId = req.user?.id;
            const result = await onboardingService.submitOnboarding(userId, req.body);
            return res.status(201).json(result);
        } catch (e) {
            const mapped = mapOnboardingError(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    return router;
}
