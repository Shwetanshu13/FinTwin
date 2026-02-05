import { calculateFinancialProfile } from "./profile.js";

export const calculateProfileAfterExpenseChanges = (
    existingSavings,
    existingExpenses,
    incomeWithDatesList,
    updatedExpensesWithDatesList
) => {
    return calculateFinancialProfile(
        existingSavings,
        existingExpenses,
        incomeWithDatesList,
        updatedExpensesWithDatesList
    );
};
