import { calculateFinancialProfile } from "./profile.js";

export const calculateProfileAfterIncomeChanges = (
    existingSavings,
    existingExpenses,
    updatedIncomeWithDatesList,
    expensesWithDatesList
) => {
    return calculateFinancialProfile(
        existingSavings,
        existingExpenses,
        updatedIncomeWithDatesList,
        expensesWithDatesList
    );
};
