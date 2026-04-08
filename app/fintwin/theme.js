import { Platform } from "react-native";

export const colors = {
  // Backgrounds
  background: "#F8F9FA",
  surface: "#FFFFFF",

  // Primary — Electric Teal
  primary: "#0D9488",
  primaryLight: "#CCFBF1",
  primaryDark: "#0F766E",

  // Text hierarchy
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",

  // Semantic
  positive: "#10B981",
  positiveLt: "#D1FAE5",
  negative: "#F43F5E",
  negativeLt: "#FEF2F2",
  warning: "#F59E0B",
  warningLt: "#FEF3C7",

  // Input / borders
  inputBg: "#F1F3F5",
  border: "#E2E8F0",
  divider: "#F1F5F9",

  // Misc
  white: "#FFFFFF",
  black: "#000000",

  // Legacy aliases (keep for backward compatibility in forms/)
  dark: "#1E293B",
  slate: "#64748B",
  accent: "#0D9488",
  light: "#F8F9FA",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  hero: 36,
};

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    android: {
      elevation: 2,
    },
  }),
  cardHeavy: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 4,
    },
  }),
  subtle: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    android: {
      elevation: 1,
    },
  }),
};

export default colors;
