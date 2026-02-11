import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#111",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: "#111",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    secondaryButtonText: {
        color: "#111",
        fontSize: 16,
        fontWeight: "600",
    },
    link: {
        color: "#111",
        fontWeight: "600",
        textAlign: "center",
        marginTop: 4,
    },
    error: {
        color: "#b00020",
        textAlign: "center",
    },
    hint: {
        color: "#444",
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
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    chip: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    chipActive: {
        borderColor: "#111",
    },
    chipText: {
        color: "#111",
        fontWeight: "600",
    },
});
