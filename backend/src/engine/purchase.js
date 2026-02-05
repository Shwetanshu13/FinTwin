import {
  calculateTotalIncomeTillDate,
  calculateTotalExpensesTillDate,
  calculateTotalMonthlyExpenses,
  calculateTotalMonthlyIncome
} from "../utils/engineCalculationDates.js";




export const oneTimePurchase = (
  purchaseAmount,
  existingSavings,
  existingExpenses,
  incomeWithDatesList,
  expensesWithDatesList
) => {

  // 1. Calculate total income over time
  const totalIncome = calculateTotalIncomeTillDate(incomeWithDatesList);

  // 2. Calculate total variable/dated expenses over time
  const totalExpenses = calculateTotalExpensesTillDate(expensesWithDatesList);

  // 3. Calculate total monthly expenses 
  const totalMontlyExpense = calculateTotalMonthlyExpenses(expensesWithDatesList);


  // 4. Final savings calculation
  const finalSavings = existingSavings + totalIncome - existingExpenses - totalExpenses - purchaseAmount;


  // 5. Affordability calculation
  const affordability = finalSavings >= 0 ? true : false;

  // 6. Runway calculation
  const runwayMonths = finalSavings / totalMontlyExpense;


  return {
    finalSavings,
    affordability,
    runwayMonths
  };
};


export const emiPurchase = (
  emiAmount,
  emiTenureMonths,
  existingSavings,
  existingExpenses,
  incomeWithDatesList,
  expensesWithDatesList
) => {
  // 1. Calculate total income over time
  const totalIncome = calculateTotalIncomeTillDate(incomeWithDatesList);

  // 2. Calculate total variable/dated expenses over time
  const totalExpenses = calculateTotalExpensesTillDate(expensesWithDatesList);

  // 3. Calculate total variable/dated expenses over time
  const totalMonthlyIncome = calculateTotalMonthlyIncome(incomeWithDatesList);

  // 4. Calculate total monthly expenses 
  const totalMontlyExpense = calculateTotalMonthlyExpenses(expensesWithDatesList);

  // 5. Final savings calculation
  const finalSavings = existingSavings + totalIncome - existingExpenses - totalExpenses;

  // 6. Increased expenses calculation
  const increasedMonthlyExpenses = totalMontlyExpense + emiAmount;

  // 7. Decreased monthly savings calculation
  const decreasedMonthlySavings = totalMonthlyIncome - increasedMonthlyExpenses;

  // 8. Affordability calculation
  const affordability = decreasedMonthlySavings >= 0 ? true : false;

  // 9. Runway calculation
  const runwayMonths = finalSavings / increasedMonthlyExpenses;

  return {
    finalSavings,
    affordability,
    runwayMonths,
    increasedMonthlyExpenses,
    decreasedMonthlySavings
  };

}
