export const calculateTotalIncomeTillDate = (incomeListWithDates) => {
    const totalIncome = incomeListWithDates.reduce(
        (sum, item) => sum + item.amount * item.months,
        0
    );
    return totalIncome;
}

export const calculateTotalExpensesTillDate = (expensesListWithDates) => {
    const totalExpenses = expensesListWithDates.reduce(
        (sum, item) => sum + item.amount * item.months,
        0
    );
    return totalExpenses;
}

export const calculateTotalMonthlyIncome = (incomeListWithDates) => {
    const totalMonthlyIncome = incomeListWithDates.reduce(
        (sum, item) => sum + item.amount,
        0
    );
    return totalMonthlyIncome;
}

export const calculateTotalMonthlyExpenses = (expensesListWithDates) => {
    const totalMonthlyExpenses = expensesListWithDates.reduce(
        (sum, item) => sum + item.amount,
        0
    );
    return totalMonthlyExpenses;
}