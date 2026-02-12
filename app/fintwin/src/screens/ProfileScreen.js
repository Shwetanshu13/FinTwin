import { useEffect, useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { getProfile, updateProfile } from "../api/profile";
import { setAuthResult as setSessionAuthResult } from "../session/authSession";
import { saveAuthResult } from "../storage/auth";
import { sharedStyles } from "./shared";

import colors from "../../theme";

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
            setSuccess("PROFILE_UPDATED");
        } catch (e) {
            setError(e?.message || "REQUEST_FAILED");
        } finally {
            setSaving(false);
        }
    }

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
                <View style={styles.headerCard}>
                    <Text style={sharedStyles.title}>Profile</Text>
                    <Text style={sharedStyles.hint}>Signed in as {signedInAs}</Text>

                    {errorText ? <Text style={sharedStyles.error}>{errorText}</Text> : null}
                    {success ? <Text style={sharedStyles.success}>{success}</Text> : null}
                    {loading ? <Text style={sharedStyles.hint}>Loading...</Text> : null}

                    <View style={styles.topActions}>
                        <Pressable style={sharedStyles.secondaryButton} onPress={onGoHome} disabled={loading || saving}>
                            <Text style={sharedStyles.secondaryButtonText}>Home</Text>
                        </Pressable>
                        <Pressable style={sharedStyles.secondaryButton} onPress={onLogout} disabled={loading || saving}>
                            <Text style={sharedStyles.secondaryButtonText}>Log out</Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={sharedStyles.sectionTitle}>Username</Text>
                <TextInput
                    value={draft.username}
                    onChangeText={(v) => setDraft((p) => ({ ...p, username: v }))}
                    autoCapitalize="none"
                    style={sharedStyles.input}
                    editable={!loading && !saving}
                    returnKeyType="next"
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />

                <Text style={sharedStyles.sectionTitle}>Email</Text>
                <TextInput
                    value={draft.email}
                    onChangeText={(v) => setDraft((p) => ({ ...p, email: v }))}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={sharedStyles.input}
                    editable={!loading && !saving}
                    returnKeyType="next"
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />

                <Text style={sharedStyles.sectionTitle}>Full name</Text>
                <TextInput
                    value={draft.fullName}
                    onChangeText={(v) => setDraft((p) => ({ ...p, fullName: v }))}
                    style={sharedStyles.input}
                    editable={!loading && !saving}
                    returnKeyType="next"
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />

                <Text style={sharedStyles.sectionTitle}>Phone</Text>
                <TextInput
                    value={draft.phone}
                    onChangeText={(v) => setDraft((p) => ({ ...p, phone: v }))}
                    keyboardType="phone-pad"
                    style={sharedStyles.input}
                    editable={!loading && !saving}
                    returnKeyType="done"
                    placeholderTextColor="rgba(34, 40, 49, 0.45)"
                />

                <Pressable style={sharedStyles.button} onPress={onSave} disabled={loading || saving}>
                    <Text style={sharedStyles.buttonText}>{saving ? "Saving..." : "Save changes"}</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = {
    scroll: {
        backgroundColor: colors.light,
    },
    container: {
        padding: 20,
        paddingBottom: 32,
        gap: 12,
        backgroundColor: colors.light,
    },
    headerCard: {
        borderWidth: 1,
        borderColor: "rgba(34, 40, 49, 0.12)",
        borderRadius: 16,
        padding: 14,
        gap: 6,
        backgroundColor: colors.white,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            },
            android: {
                elevation: 1,
            },
        }),
    },
    topActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 6,
    },
};
