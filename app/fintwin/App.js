import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CalcScreen } from "./src/screens/CalcScreen";

import { clearAuthResult, loadAuthResult, saveAuthResult } from "./src/storage/auth";
import {
  clearAuth as clearSessionAuth,
  setAuthResult as setSessionAuthResult,
  subscribeAuth,
} from "./src/session/authSession";

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
        <Text>Loading...</Text>
      </View>
    );
  } else if (authResult) {
    if (route === "onboarding") {
      content = (
        <OnboardingScreen
          authResult={authResult}
          onGoHome={() => setRoute("home")}
          onLogout={onLogout}
        />
      );
    } else if (route === "calc") {
      content = (
        <CalcScreen
          authResult={authResult}
          onGoHome={() => setRoute("home")}
          onLogout={onLogout}
        />
      );
    } else {
      content = (
        <HomeScreen
          authResult={authResult}
          onGoOnboarding={() => setRoute("onboarding")}
          onGoCalc={() => setRoute("calc")}
          onLogout={onLogout}
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
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
