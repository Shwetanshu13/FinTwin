import { date, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { expenseTypeEnums } from "../constants";

const expenseTypeEnum = pgEnum("expense_type", expenseTypeEnums);

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 15 }),
    fullName: varchar("fullName", { length: 100 }).notNull(),
    createdAt: datetime("createdAt").notNull().defaultNow(),
});

export const incomeTable = pgTable("income", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().references(() => usersTable.id),
    amount: integer().notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    startDate: date("startDate").notNull(),
    endDate: date("endDate"),
    createdAt: datetime("createdAt").notNull().defaultNow(),
});

export const expensesTable = pgTable("expenses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().references(() => usersTable.id),
    amount: integer().notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    type: expenseTypeEnum("type").notNull(),
    startDate: date("startDate").notNull(),
    endDate: date("endDate"),
    createdAt: datetime("createdAt").notNull().defaultNow(),
});

export const savingsTable = pgTable("savings", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().references(() => usersTable.id),
    amount: integer().notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    creditDate: date("creditDate").notNull(),
    createdAt: datetime("createdAt").notNull().defaultNow(),
});
