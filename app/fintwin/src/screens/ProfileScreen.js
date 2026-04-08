import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { getProfile, updateProfile } from "../api/profile";
import { setAuthResult as setSessionAuthResult } from "../session/authSession";
import { saveAuthResult } from "../storage/auth";
import { sharedStyles } from "./shared";
import { FormField } from "../components/FormField";

import { colors, fontSizes, radii, shadows, spacing } from "../../theme";

export function ProfileScreen({ authResult, onGoHome, onLogout }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const errorText = useMemo(() => {
        if (!error) return null;
        if (error === "USER_NOT_FOUND") return "Account not found. Please log out and sign in again.";
        return error;
    }, [error]);

    const [success, setSuccess] = useState(null);

    const initialUser = authResult?.user || null;

    const [draft, setDraft] = useState({
        username: initialUser?.username ?? "",
        email: initialUser?.email ?? "",
        fullName: initialUser?.fullName ?? "",
        phone: initialUser?.phone ?? "",
    });

    const signedInAs =
        authResult?.user?.fullName || authResult?.user?.username || authResult?.userId;

    const canLoad = useMemo(
        () => Boolean(authResult?.token?.accessToken),
        [authResult?.token?.accessToken]
    );

    useEffect(() => {
        if (!canLoad) return;
        let cancelled = false;
        (async () => {
            setError(null);
            setSuccess(null);
            setLoading(true);
            try {
                const res = await getProfile();
                if (cancelled) return;
                const user = res?.user;
                if (user) {
                    setDraft({
                        username: user.username ?? "",
                        email: user.email ?? "",
                        fullName: user.fullName ?? "",
                        phone: user.phone ?? "",
                    });
                }
            } catch (e) {
                if (!cancelled) setError(e?.message || "REQUEST_FAILED");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [canLoad]);

    async function onSave() {
        setError(null);
        setSuccess(null);
        setSaving(true);
        try {
            const patch = {
                username: draft.username.trim(),
                email: draft.email.trim(),
                fullName: draft.fullName.trim(),
                phone: draft.phone.trim() ? draft.phone.trim() : null,
            };

            const res = await updateProfile(patch);
            const user = res?.user;
            if (user) {
                const nextAuth = { ...(authResult || {}) };
                nextAuth.user = user;
                setSessionAuthResult(nextAuth);
                void saveAuthResult(nextAuth);
            }
            setSuccess("Profile updated successfully!");
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        } finally {
            setSaving(false);
        }
    }

    // Generate initials for avatar
    const initials = useMemo(() => {
        const name = draft.fullName || draft.username || "";
        const parts = name.split(" ").filter(Boolean);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return (parts[0]?.[0] || "?").toUpperCase();
    }, [draft.fullName, draft.username]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentInsetAdjustmentBehavior="always"
            >
                {/* ── Header ── */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* ── Avatar card ── */}
                <View style={styles.avatarCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.avatarName}>{signedInAs}</Text>
                    <Text style={styles.avatarEmail}>{draft.email}</Text>
                </View>

                {errorText ? <Text style={sharedStyles.error}>{errorText}</Text> : null}
                {success ? <Text style={sharedStyles.success}>{success}</Text> : null}
                {loading ? (
                    <ActivityIndicator
                        size="small"
                        color={colors.primary}
                        style={{ marginVertical: spacing.lg }}
                    />
                ) : null}

                {/* ── Form ── */}
                <View style={styles.formCard}>
                    <Text style={styles.formCardTitle}>Personal Information</Text>
                    <FormField
                        label="Username"
                        value={draft.username}
                        onChangeText={(v) => setDraft((p) => ({ ...p, username: v }))}
                        autoCapitalize="none"
                        editable={!loading && !saving}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Email"
                        value={draft.email}
                        onChangeText={(v) => setDraft((p) => ({ ...p, email: v }))}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!loading && !saving}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Full Name"
                        value={draft.fullName}
                        onChangeText={(v) => setDraft((p) => ({ ...p, fullName: v }))}
                        editable={!loading && !saving}
                        returnKeyType="next"
                    />
                    <FormField
                        label="Phone"
                        value={draft.phone}
                        onChangeText={(v) => setDraft((p) => ({ ...p, phone: v }))}
                        keyboardType="phone-pad"
                        editable={!loading && !saving}
                        returnKeyType="done"
                    />
                </View>

                {/* ── Save button ── */}
                <Pressable
                    style={({ pressed }) => [
                        sharedStyles.button,
                        pressed && { opacity: 0.85 },
                    ]}
                    onPress={onSave}
                    disabled={loading || saving}
                >
                    <Text style={sharedStyles.buttonText}>
                        {saving ? "Saving…" : "Save Changes"}
                    </Text>
                </Pressable>

                {/* ── Log out ── */}
                <Pressable
                    style={({ pressed }) => [
                        styles.logoutBtn,
                        pressed && { opacity: 0.7 },
                    ]}
                    onPress={onLogout}
                    disabled={loading || saving}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        backgroundColor: colors.background,
    },
    container: {
        padding: spacing.xxl,
        paddingBottom: spacing.xxxl + 16,
        gap: spacing.lg,
        backgroundColor: colors.background,
    },
    header: {
        marginBottom: spacing.xs,
    },
    title: {
        fontSize: fontSizes.xxl + 4,
        fontWeight: "900",
        color: colors.textPrimary,
        letterSpacing: -0.8,
    },

    /* Avatar card */
    avatarCard: {
        backgroundColor: colors.surface,
        borderRadius: radii.xl,
        padding: spacing.xxl,
        alignItems: "center",
        gap: spacing.xs,
        ...shadows.card,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.sm,
    },
    avatarText: {
        fontSize: fontSizes.xxl,
        fontWeight: "800",
        color: colors.primary,
    },
    avatarName: {
        fontSize: fontSizes.lg,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    avatarEmail: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
    },

    /* Form card */
    formCard: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.xl,
        gap: spacing.lg,
        ...shadows.card,
    },
    formCardTitle: {
        fontSize: fontSizes.xs,
        fontWeight: "800",
        color: colors.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },

    /* Log out */
    logoutBtn: {
        paddingVertical: spacing.lg,
        alignItems: "center",
        marginTop: spacing.sm,
    },
    logoutText: {
        fontSize: fontSizes.md,
        fontWeight: "700",
        color: colors.negative,
    },
});
