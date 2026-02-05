export const calculateFinalSavings = (
    existingSavings,
    totalIncome,
    existingExpenses,
    totalVariableExpenses
) => {
    const safeExistingSavings = Number(existingSavings) || 0;
    const safeTotalIncome = Number(totalIncome) || 0;
    const safeExistingExpenses = Number(existingExpenses) || 0;
    const safeVariableExpenses = Number(totalVariableExpenses) || 0;

    return (
        safeExistingSavings +
        safeTotalIncome -
        safeExistingExpenses -
        safeVariableExpenses
    );
};

export const calculateMonthlyNetSavings = (totalMonthlyIncome, totalMonthlyExpense) => {
    const safeIncome = Number(totalMonthlyIncome) || 0;
    const safeExpense = Number(totalMonthlyExpense) || 0;
    return safeIncome - safeExpense;
};
