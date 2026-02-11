let currentAuthResult = null;
const listeners = new Set();

export function getAuthResult() {
    return currentAuthResult;
}

export function setAuthResult(next) {
    currentAuthResult = next;
    for (const listener of listeners) {
        try {
            listener(currentAuthResult);
        } catch {
            // ignore listener failures
        }
    }
}

export function clearAuth() {
    setAuthResult(null);
}

export function subscribeAuth(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
