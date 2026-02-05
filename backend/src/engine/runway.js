export const calculateRunwayMonths = (finalSavings, totalMonthlyExpense) => {
    if (!Number.isFinite(finalSavings)) return null;
    if (!Number.isFinite(totalMonthlyExpense)) return null;
    if (totalMonthlyExpense <= 0) return null;
    return finalSavings / totalMonthlyExpense;
};
