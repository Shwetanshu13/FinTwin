import { Router } from "express";

import { createAuthRouter } from "../controllers/auth/auth.controller.js";
import { createOnboardingRouter } from "../controllers/onboarding/onboarding.controller.js";
import { createRecordsRouter } from "../controllers/records/records.controller.js";
import { createCalcRouter } from "../controllers/calc/calc.controller.js";
import { createProfileRouter } from "../controllers/profile/profile.controller.js";

import { createHealthRouter } from "./health.routes.js";

export function createApiRouter({
    authService,
    userRepo,
    onboardingService,
    recordsService,
    calcService,
    profileService,
}) {
    const router = Router();

    router.use(createHealthRouter());
    router.use("/auth", createAuthRouter({ authService, userRepo }));
    router.use("/profile", createProfileRouter({ profileService, userRepo }));
    router.use(
        "/onboarding",
        createOnboardingRouter({ onboardingService, userRepo })
    );
    router.use("/records", createRecordsRouter({ recordsService, userRepo }));
    router.use("/calc", createCalcRouter({ calcService, userRepo }));

    return router;
}
