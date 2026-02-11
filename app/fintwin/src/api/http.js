import { API_BASE_URL } from "../config/api";
import { clearAuth, getAuthResult, setAuthResult } from "../session/authSession";
import { clearAuthResult, saveAuthResult } from "../storage/auth";

async function readJsonSafely(response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
}

function toHttpError(response, data) {
    const errorCode = data?.error || "REQUEST_FAILED";
    const error = new Error(errorCode);
    error.status = response.status;
    error.data = data;
    return error;
}

async function fetchJson(path, { method = "GET", body, headers = {} } = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await readJsonSafely(response);
    return { response, data };
}

export async function requestJson(path, { method = "GET", body } = {}) {
    const { response, data } = await fetchJson(path, { method, body });
    if (!response.ok) throw toHttpError(response, data);
    return data;
}

export async function requestJsonWithHeaders(
    path,
    { method = "GET", body, headers = {} } = {}
) {
    const { response, data } = await fetchJson(path, { method, body, headers });
    if (!response.ok) throw toHttpError(response, data);
    return data;
}

let refreshPromise = null;

async function refreshAccessToken() {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const existing = getAuthResult();
        const refreshToken = existing?.token?.refreshToken;
        if (!refreshToken) {
            throw new Error("MISSING_REFRESH_TOKEN");
        }

        const { response, data } = await fetchJson("/auth/refresh", {
            method: "POST",
            body: { refreshToken },
        });

        if (!response.ok) {
            const err = toHttpError(response, data);
            clearAuth();
            void clearAuthResult();
            throw err;
        }

        setAuthResult(data);
        void saveAuthResult(data);
        return data;
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

export async function requestJsonAuthed(path, { method = "GET", body, headers = {} } = {}) {
    const auth = getAuthResult();
    const accessToken = auth?.token?.accessToken;
    if (!accessToken) {
        const err = new Error("MISSING_ACCESS_TOKEN");
        err.status = 401;
        throw err;
    }

    try {
        return await requestJsonWithHeaders(path, {
            method,
            body,
            headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (e) {
        if (e?.status !== 401) throw e;
        await refreshAccessToken();
        const authAfter = getAuthResult();
        const newAccessToken = authAfter?.token?.accessToken;
        if (!newAccessToken) throw e;

        return requestJsonWithHeaders(path, {
            method,
            body,
            headers: {
                ...headers,
                Authorization: `Bearer ${newAccessToken}`,
            },
        });
    }
}
