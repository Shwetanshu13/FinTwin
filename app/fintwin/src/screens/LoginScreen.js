import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
} from "react-native";

import { login } from "../api/auth";
import { sharedStyles } from "./shared";

export function LoginScreen({ onGoToRegister, onAuthSuccess, authResult }) {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function onSubmit() {
        setError(null);
        if (!identifier.trim() || !password) {
            setError("MISSING_FIELDS");
            return;
        }

        setLoading(true);
        try {
            const result = await login({
                identifier: identifier.trim(),
                password,
            });
            onAuthSuccess?.(result);
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={sharedStyles.screen}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentInsetAdjustmentBehavior="always"
            >
                <Text style={sharedStyles.title}>Login</Text>
                <Text style={sharedStyles.hint}>Use email or username.</Text>

                {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
                {authResult?.user?.id ? (
                    <Text style={sharedStyles.success}>
                        Signed in as {authResult.user.fullName || authResult.user.username}
                    </Text>
                ) : null}

                <TextInput
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="Email or username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={sharedStyles.input}
                    editable={!loading}
                    returnKeyType="next"
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    style={sharedStyles.input}
                    editable={!loading}
                    returnKeyType="done"
                />

                <Pressable style={sharedStyles.button} onPress={onSubmit} disabled={loading}>
                    <Text style={sharedStyles.buttonText}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Text>
                </Pressable>

                <Pressable onPress={onGoToRegister} disabled={loading}>
                    <Text style={sharedStyles.link}>Create an account</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
