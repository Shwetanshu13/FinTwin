import { Router } from "express";

export function createHealthRouter() {
    const router = Router();

    router.get("/", (req, res) =>
        res.json({ ok: true, service: "fintwin-backend" })
    );
    router.get("/health", (req, res) => res.json({ ok: true }));

    return router;
}
