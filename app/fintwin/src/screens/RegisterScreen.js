import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
} from "react-native";

import { register } from "../api/auth";
import { sharedStyles } from "./shared";

export function RegisterScreen({ onGoToLogin, onAuthSuccess, authResult }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function onSubmit() {
        setError(null);
        if (!username.trim() || !email.trim() || !fullName.trim() || !password) {
            setError("MISSING_FIELDS");
            return;
        }

        setLoading(true);
        try {
            const result = await register({
                username: username.trim(),
                email: email.trim(),
                fullName: fullName.trim(),
                phone: phone.trim() ? phone.trim() : undefined,
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
                <Text style={sharedStyles.title}>Register</Text>
                <Text style={sharedStyles.hint}>Create your account.</Text>

                {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
                {authResult?.user?.id ? (
                    <Text style={sharedStyles.success}>
                        Account created for {authResult.user.fullName || authResult.user.username}
                    </Text>
                ) : null}

                <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Full name"
                    autoCapitalize="words"
                    style={sharedStyles.input}
                    editable={!loading}
                    returnKeyType="next"
                />
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={sharedStyles.input}
                    editable={!loading}
                    returnKeyType="next"
                />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    style={sharedStyles.input}
                    editable={!loading}
                    returnKeyType="next"
                />
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone (optional)"
                    keyboardType="phone-pad"
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
                        {loading ? "Creating..." : "Create account"}
                    </Text>
                </Pressable>

                <Pressable onPress={onGoToLogin} disabled={loading}>
                    <Text style={sharedStyles.link}>I already have an account</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
