import { createApiRouter } from "./api.routes.js";
import { notFoundHandler } from "./notFound.middleware.js";

export function registerRoutes(app, deps) {
    // Support both unprefixed routes ("/auth", "/profile", ...) and
    // an optional "/api" prefix for deployments/proxies.
    app.use(createApiRouter(deps));
    app.use("/api", createApiRouter(deps));
    app.use(notFoundHandler);
}
