import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, Platform, Pressable } from "react-native";

import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CalcScreen } from "./src/screens/CalcScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

import { clearAuthResult, loadAuthResult, saveAuthResult } from "./src/storage/auth";
import {
  clearAuth as clearSessionAuth,
  setAuthResult as setSessionAuthResult,
  subscribeAuth,
} from "./src/session/authSession";

import { colors, fontSizes, shadows } from "./theme";

function BottomNavBar({ currentRoute, setRoute }) {
  return (
    <View style={navStyles.container}>
      <Pressable style={navStyles.tab} onPress={() => setRoute("home")}>
        <Text style={[navStyles.icon, currentRoute === "home" && navStyles.activeIcon]}>🏠</Text>
        <Text style={[navStyles.label, currentRoute === "home" && navStyles.activeLabel]}>Home</Text>
      </Pressable>
      <Pressable style={navStyles.tab} onPress={() => setRoute("calc")}>
        <Text style={[navStyles.icon, currentRoute === "calc" && navStyles.activeIcon]}>📊</Text>
        <Text style={[navStyles.label, currentRoute === "calc" && navStyles.activeLabel]}>Calculations</Text>
      </Pressable>
      <Pressable style={navStyles.tab} onPress={() => setRoute("profile")}>
        <Text style={[navStyles.icon, currentRoute === "profile" && navStyles.activeIcon]}>👤</Text>
        <Text style={[navStyles.label, currentRoute === "profile" && navStyles.activeLabel]}>Profile</Text>
      </Pressable>
    </View>
  );
}

const navStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 10,
    ...shadows.card,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  icon: {
    fontSize: 22,
    opacity: 0.4,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: "800",
  },
});

export default function App() {
  const [route, setRoute] = useState("login");
  const [authResult, setAuthResult] = useState(null);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    return subscribeAuth((next) => {
      setAuthResult(next);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await loadAuthResult();
        if (cancelled) return;
        if (stored) {
          setSessionAuthResult(stored);
          setRoute("home");
        }
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const commonProps = useMemo(
    () => ({
      authResult,
      onAuthSuccess: (result) => {
        setSessionAuthResult(result);
        setRoute("home");
        void saveAuthResult(result);
      },
    }),
    [authResult]
  );

  const onLogout = useMemo(
    () => () => {
      clearSessionAuth();
      setRoute("login");
      void clearAuthResult();
    },
    []
  );

  let content;
  if (hydrating) {
    content = (
      <View style={styles.loading}>
        <Text style={styles.brandName}>FinTwin</Text>
        <Text style={styles.brandTag}>Your financial twin</Text>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 24 }}
        />
      </View>
    );
  } else if (authResult) {
    if (route === "calc") {
      content = (
        <CalcScreen
          authResult={authResult}
          onGoHome={() => setRoute("home")}
        />
      );
    } else if (route === "profile") {
      content = (
        <ProfileScreen
          authResult={authResult}
          onGoHome={() => setRoute("home")}
          onLogout={onLogout}
        />
      );
    } else {
      content = (
        <HomeScreen
          authResult={authResult}
          onGoCalc={() => setRoute("calc")}
          onGoProfile={() => setRoute("profile")}
        />
      );
    }
  } else {
    content =
      route === "login" ? (
        <LoginScreen
          {...commonProps}
          onGoToRegister={() => setRoute("register")}
        />
      ) : (
        <RegisterScreen
          {...commonProps}
          onGoToLogin={() => setRoute("login")}
        />
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      {content}
      {authResult && !hydrating && (
        <BottomNavBar currentRoute={route} setRoute={setRoute} />
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: -1,
  },
  brandTag: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
});
