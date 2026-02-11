import { createApiRouter } from "./api.routes.js";
import { notFoundHandler } from "./notFound.middleware.js";

export function registerRoutes(app, deps) {
    app.use(createApiRouter(deps));
    app.use(notFoundHandler);
}
