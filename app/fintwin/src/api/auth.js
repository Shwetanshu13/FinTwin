import { requestJson } from "./http";

export async function login({ identifier, password }) {
    return requestJson("/auth/login", {
        method: "POST",
        body: { identifier, password },
    });
}

export async function register({ username, email, password, fullName, phone }) {
    return requestJson("/auth/register", {
        method: "POST",
        body: { username, email, password, fullName, phone },
    });
}

export async function refresh(refreshToken) {
    return requestJson("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
    });
}
