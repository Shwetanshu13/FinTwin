import { Platform } from "react-native";

function defaultBaseUrl() {
    // Android emulator cannot reach your host machine via localhost.
    if (Platform.OS === "android") return "http://10.0.2.2:3000";
    return "http://localhost:3000";
}

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || defaultBaseUrl();
