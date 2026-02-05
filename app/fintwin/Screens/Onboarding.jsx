import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function OnboardingScreen({ navigation }) {
  const [onboardingData, setOnboardingData] = useState({
    incomeSources: [{ title: "", amount: "" }],
    expenses: [{ title: "", amount: "", type: "Fixed" }],
    savings: [{ title: "", amount: "", creditDate: "" }],
  });

  /* ---------------- INCOME ---------------- */
  const updateIncome = (index, field, value) => {
    const updated = [...onboardingData.incomeSources];
    updated[index][field] = value;
    setOnboardingData({ ...onboardingData, incomeSources: updated });
  };

  /* ---------------- EXPENSE ---------------- */
  const updateExpense = (index, field, value) => {
    const updated = [...onboardingData.expenses];
    updated[index][field] = value;
    setOnboardingData({ ...onboardingData, expenses: updated });
  };

  /* ---------------- SAVINGS ---------------- */
  const updateSaving = (index, field, value) => {
    const updated = [...onboardingData.savings];
    updated[index][field] = value;
    setOnboardingData({ ...onboardingData, savings: updated });
  };

  const handleSubmit = () => {
    console.log("Onboarding Data:", onboardingData);
    // later: save to backend / AsyncStorage
    navigation.replace("Dashboard");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Financial Setup</Text>

      {/* ================= INCOME ================= */}
      <Text style={styles.sectionTitle}>Income Sources</Text>
      {onboardingData.incomeSources.map((item, index) => (
        <View key={index} style={styles.card}>
          <TextInput
            placeholder="Income Title"
            style={styles.input}
            value={item.title}
            onChangeText={(text) =>
              updateIncome(index, "title", text)
            }
          />
          <TextInput
            placeholder="Amount"
            style={styles.input}
            keyboardType="numeric"
            value={item.amount}
            onChangeText={(text) =>
              updateIncome(index, "amount", text)
            }
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() =>
          setOnboardingData({
            ...onboardingData,
            incomeSources: [
              ...onboardingData.incomeSources,
              { title: "", amount: "" },
            ],
          })
        }
      >
        <Text style={styles.addBtn}>+ Add Income Source</Text>
      </TouchableOpacity>

      {/* ================= EXPENSE ================= */}
      <Text style={styles.sectionTitle}>Expenses</Text>
      {onboardingData.expenses.map((item, index) => (
        <View key={index} style={styles.card}>
          <TextInput
            placeholder="Expense Title"
            style={styles.input}
            value={item.title}
            onChangeText={(text) =>
              updateExpense(index, "title", text)
            }
          />
          <TextInput
            placeholder="Amount"
            style={styles.input}
            keyboardType="numeric"
            value={item.amount}
            onChangeText={(text) =>
              updateExpense(index, "amount", text)
            }
          />

          <View style={styles.typeRow}>
            {["Fixed", "Variable", "EMI"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeBtn,
                  item.type === type && styles.activeType,
                ]}
                onPress={() =>
                  updateExpense(index, "type", type)
                }
              >
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() =>
          setOnboardingData({
            ...onboardingData,
            expenses: [
              ...onboardingData.expenses,
              { title: "", amount: "", type: "Fixed" },
            ],
          })
        }
      >
        <Text style={styles.addBtn}>+ Add Expense</Text>
      </TouchableOpacity>

      {/* ================= SAVINGS ================= */}
      <Text style={styles.sectionTitle}>Savings</Text>
      {onboardingData.savings.map((item, index) => (
        <View key={index} style={styles.card}>
          <TextInput
            placeholder="Saving Title"
            style={styles.input}
            value={item.title}
            onChangeText={(text) =>
              updateSaving(index, "title", text)
            }
          />
          <TextInput
            placeholder="Amount"
            style={styles.input}
            keyboardType="numeric"
            value={item.amount}
            onChangeText={(text) =>
              updateSaving(index, "amount", text)
            }
          />
          <TextInput
            placeholder="Credit Date (Day of Month)"
            style={styles.input}
            keyboardType="numeric"
            value={item.creditDate}
            onChangeText={(text) =>
              updateSaving(index, "creditDate", text)
            }
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() =>
          setOnboardingData({
            ...onboardingData,
            savings: [
              ...onboardingData.savings,
              { title: "", amount: "", creditDate: "" },
            ],
          })
        }
      >
        <Text style={styles.addBtn}>+ Add Saving</Text>
      </TouchableOpacity>

      {/* ================= SUBMIT ================= */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Finish Setup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 25,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addBtn: {
    color: "#2563eb",
    marginBottom: 20,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeBtn: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    width: "30%",
    alignItems: "center",
  },
  activeType: {
    backgroundColor: "#bfdbfe",
  },
  submitBtn: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
