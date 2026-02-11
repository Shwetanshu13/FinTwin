import * as SecureStore from "expo-secure-store";

const KEY = "AUTH_RESULT_V1";

export async function loadAuthResult() {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        const accessToken = parsed?.token?.accessToken;
        const refreshToken = parsed?.token?.refreshToken;
        if (!accessToken || !refreshToken) return null;
        return parsed;
    } catch {
        return null;
    }
}

export async function saveAuthResult(authResult) {
    if (!authResult) return;
    await SecureStore.setItemAsync(KEY, JSON.stringify(authResult));
}

export async function clearAuthResult() {
    await SecureStore.deleteItemAsync(KEY);
}
