import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";

function mapProfileErrorToHttp(error) {
    const code = error?.message || "UNKNOWN";

    switch (code) {
        case "MISSING_FIELDS":
            return { status: 400, body: { error: code } };
        case "EMAIL_EXISTS":
        case "USERNAME_EXISTS":
            return { status: 409, body: { error: code } };
        case "USER_NOT_FOUND":
            return { status: 404, body: { error: code } };
        default:
            return { status: 500, body: { error: "INTERNAL_SERVER_ERROR" } };
    }
}

export function createProfileRouter({ profileService, userRepo }) {
    const router = Router();

    router.get("/", requireAuth(userRepo), async (req, res) => {
        try {
            const userId = req.user?.id;
            const user = await profileService.getProfile(userId);
            return res.status(200).json({ user });
        } catch (e) {
            const mapped = mapProfileErrorToHttp(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    router.patch("/", requireAuth(userRepo), async (req, res) => {
        try {
            const userId = req.user?.id;
            const user = await profileService.updateProfile(userId, req.body ?? {});
            return res.status(200).json({ user });
        } catch (e) {
            const mapped = mapProfileErrorToHttp(e);
            return res.status(mapped.status).json(mapped.body);
        }
    });

    return router;
}
