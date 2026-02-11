import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";

export function createCalcRouter({ calcService, userRepo }) {
    const router = Router();

    router.post("/profile", requireAuth(userRepo), async (req, res) => {
        try {
            const result = await calcService.calculateProfileFromDb(req.user.id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(400).json({ error: "INVALID_PAYLOAD" });
        }
    });

    router.post("/runway", requireAuth(userRepo), async (req, res) => {
        try {
            const result = await calcService.calculateRunwayFromDb(req.user.id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(400).json({ error: "INVALID_PAYLOAD" });
        }
    });

    router.post("/savings", requireAuth(userRepo), async (req, res) => {
        try {
            const result = await calcService.calculateSavingsFromDb(req.user.id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(400).json({ error: "INVALID_PAYLOAD" });
        }
    });

    router.post("/purchase/one-time", requireAuth(userRepo), async (req, res) => {
        try {
            const result = await calcService.calculateOneTimePurchaseFromDb(req.user.id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(400).json({ error: "INVALID_PAYLOAD" });
        }
    });

    router.post("/purchase/emi", requireAuth(userRepo), async (req, res) => {
        try {
            const result = await calcService.calculateEmiPurchaseFromDb(req.user.id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(400).json({ error: "INVALID_PAYLOAD" });
        }
    });

    return router;
}
