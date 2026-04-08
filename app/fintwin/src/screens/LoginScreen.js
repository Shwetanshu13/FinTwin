import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { login } from "../api/auth";
import { FormField } from "../components/FormField";
import { colors, fontSizes, spacing } from "../../theme";
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
            // console.log(result);
            onAuthSuccess?.(result);
        } catch (e) {
            // console.log(e);
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
                contentContainerStyle={styles.screen}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentInsetAdjustmentBehavior="always"
            >
                <View style={styles.brandWrap}>
                    <Text style={styles.brand}>FinTwin</Text>
                </View>

                <View style={styles.headerWrap}>
                    <Text style={styles.title}>Welcome back</Text>
                    <Text style={styles.subtitle}>
                        Sign in to your account
                    </Text>
                </View>

                {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
                {authResult?.user?.id ? (
                    <Text style={sharedStyles.success}>
                        Signed in as {authResult.user.fullName || authResult.user.username}
                    </Text>
                ) : null}

                <View style={styles.formWrap}>
                    <FormField
                        label="Email or Username"
                        value={identifier}
                        onChangeText={setIdentifier}
                        placeholder="Enter your email or username"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry
                        editable={!loading}
                        returnKeyType="done"
                    />
                </View>

                <Pressable
                    style={({ pressed }) => [
                        sharedStyles.button,
                        pressed && { opacity: 0.85 },
                    ]}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    <Text style={sharedStyles.buttonText}>
                        {loading ? "Signing in…" : "Sign In"}
                    </Text>
                </Pressable>

                <Pressable onPress={onGoToRegister} disabled={loading}>
                    <Text style={sharedStyles.link}>
                        Don't have an account?{" "}
                        <Text style={styles.linkBold}>Create one</Text>
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        padding: spacing.xxl,
        justifyContent: "center",
        gap: spacing.lg,
        backgroundColor: colors.background,
    },
    brandWrap: {
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    brand: {
        fontSize: 32,
        fontWeight: "900",
        color: colors.primary,
        letterSpacing: -0.8,
    },
    headerWrap: {
        alignItems: "center",
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: fontSizes.xxl,
        fontWeight: "800",
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
    },
    formWrap: {
        gap: spacing.lg,
    },
    linkBold: {
        fontWeight: "800",
        color: colors.primary,
    },
});
