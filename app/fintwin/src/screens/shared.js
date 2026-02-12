import { StyleSheet } from "react-native";

import colors from "../../theme";

export const sharedStyles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        gap: 12,
        backgroundColor: colors.light,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 6,
        color: colors.dark,
    },
    input: {
        borderWidth: 1,
        borderColor: "rgba(34, 40, 49, 0.18)",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: colors.white,
        color: colors.dark,
    },
    button: {
        backgroundColor: colors.accent,
        paddingVertical: 12,
        paddingHorizontal: 14,
        minHeight: 44,
        justifyContent: "center",
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: "rgba(0, 173, 181, 0.45)",
        paddingVertical: 12,
        paddingHorizontal: 14,
        minHeight: 44,
        justifyContent: "center",
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: colors.white,
    },
    secondaryButtonText: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: "600",
    },
    link: {
        color: colors.accent,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 4,
    },
    error: {
        color: "#b00020",
        textAlign: "center",
    },
    hint: {
        color: "rgba(34, 40, 49, 0.72)",
        textAlign: "center",
    },
    success: {
        color: "#1b5e20",
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 10,
        color: colors.dark,
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        borderWidth: 1,
        borderColor: "rgba(34, 40, 49, 0.18)",
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: colors.white,
    },
    chipActive: {
        borderColor: colors.accent,
    },
    chipText: {
        color: colors.dark,
        fontWeight: "600",
    },
});
