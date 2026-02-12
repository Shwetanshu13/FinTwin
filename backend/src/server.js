import express from "express";
import cors from "cors";

import { AuthService } from "./controllers/auth/auth.service.js";
import { UserRepository } from "./controllers/auth/userRepo.js";

import { OnboardingRepository } from "./controllers/onboarding/onboarding.repo.js";
import { OnboardingService } from "./controllers/onboarding/onboarding.service.js";

import { RecordsRepository } from "./controllers/records/records.repo.js";
import { RecordsService } from "./controllers/records/records.service.js";

import { CalcService } from "./controllers/calc/calc.service.js";
import { ProfileService } from "./controllers/profile/profile.service.js";

import { registerRoutes } from "./routes/index.js";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const userRepo = new UserRepository();
    const authService = new AuthService(userRepo);

    const onboardingRepo = new OnboardingRepository();
    const onboardingService = new OnboardingService(onboardingRepo);

    const recordsRepo = new RecordsRepository();
    const recordsService = new RecordsService(recordsRepo);

    const calcService = new CalcService(recordsRepo);
    const profileService = new ProfileService(userRepo);

    registerRoutes(app, {
        authService,
        userRepo,
        onboardingService,
        recordsService,
        calcService,
        profileService,
    });

    return app;
}

export function startServer() {
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    const app = createApp();

    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on http://localhost:${port}`);
    });
}
