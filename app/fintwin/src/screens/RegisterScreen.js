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

import { register } from "../api/auth";
import { FormField } from "../components/FormField";
import { colors, fontSizes, spacing } from "../../theme";
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
                contentContainerStyle={styles.screen}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentInsetAdjustmentBehavior="always"
            >
                <View style={styles.brandWrap}>
                    <Text style={styles.brand}>FinTwin</Text>
                </View>

                <View style={styles.headerWrap}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join FinTwin and take control of your finances
                    </Text>
                </View>

                {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
                {authResult?.user?.id ? (
                    <Text style={sharedStyles.success}>
                        Account created for {authResult.user.fullName || authResult.user.username}
                    </Text>
                ) : null}

                <View style={styles.formWrap}>
                    <FormField
                        label="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Your full name"
                        autoCapitalize="words"
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Choose a username"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="your@email.com"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Phone (optional)"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+91 XXXXX XXXXX"
                        keyboardType="phone-pad"
                        editable={!loading}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a strong password"
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
                        {loading ? "Creating…" : "Create Account"}
                    </Text>
                </Pressable>

                <Pressable onPress={onGoToLogin} disabled={loading}>
                    <Text style={sharedStyles.link}>
                        Already have an account?{" "}
                        <Text style={styles.linkBold}>Sign in</Text>
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
        textAlign: "center",
    },
    formWrap: {
        gap: spacing.lg,
    },
    linkBold: {
        fontWeight: "800",
        color: colors.primary,
    },
});
