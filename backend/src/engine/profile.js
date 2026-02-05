import {
    calculateTotalIncomeTillDate,
    calculateTotalExpensesTillDate,
    calculateTotalMonthlyExpenses,
    calculateTotalMonthlyIncome,
} from "../utils/engineCalculationDates.js";

import { calculateFinalSavings, calculateMonthlyNetSavings } from "./savings.js";
import { calculateRunwayMonths } from "./runway.js";

export const calculateFinancialProfile = (
    existingSavings,
    existingExpenses,
    incomeWithDatesList,
    expensesWithDatesList
) => {
    const totalIncome = calculateTotalIncomeTillDate(incomeWithDatesList);
    const totalVariableExpenses = calculateTotalExpensesTillDate(expensesWithDatesList);

    const totalMonthlyIncome = calculateTotalMonthlyIncome(incomeWithDatesList);
    const totalMonthlyExpense = calculateTotalMonthlyExpenses(expensesWithDatesList);

    const finalSavings = calculateFinalSavings(
        existingSavings,
        totalIncome,
        existingExpenses,
        totalVariableExpenses
    );

    const runwayMonths = calculateRunwayMonths(finalSavings, totalMonthlyExpense);
    const monthlyNetSavings = calculateMonthlyNetSavings(
        totalMonthlyIncome,
        totalMonthlyExpense
    );

    return {
        totalIncome,
        totalVariableExpenses,
        totalMonthlyIncome,
        totalMonthlyExpense,
        finalSavings,
        runwayMonths,
        monthlyNetSavings,
    };
};
