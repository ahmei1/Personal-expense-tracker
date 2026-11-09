import { prisma } from "../config/prisma.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "../validations/expense.validation.js";


export const createExpense = async (req, res) => {
  try {
    // 1. Validate submitted data
    const result = createExpenseSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);

      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    // 2. Extract validated expense data
    const { title, description, amount, category, date } = result.data;

    // 3. Create expense for the authenticated user
    const expense = await prisma.expense.create({
      data: {
        title,
        description: description || null,
        amount,
        category,
        date,
        userId: req.user.userId,
      },
    });

    // 4. Return created expense
    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getExpenses = async (req, res) => {
  try {
    // 1. Get expenses belonging to the authenticated user
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    // 2. Return expenses
    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const updateExpense = async (req, res) => {
  try {
    // 1. Validate the request body
    const result = updateExpenseSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);

      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    // 2. Find the expense belonging to the logged-in user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // 3. Update the expense
    const updatedExpense = await prisma.expense.update({
      where: {
        id: existingExpense.id,
      },
      data: result.data,
    });

    // 4. Return the updated expense
    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Update expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const deleteExpense = async (req, res) => {
  try {
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await prisma.expense.delete({
      where: {
        id: existingExpense.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const getMonthlySummary = async (req, res) => {
  try {
    const { month } = req.query;

    // Validate the month format
    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: "Month must be in YYYY-MM format",
      });
    }

    // Calculate the start and end of the month
    const [year, monthNumber] = month.split("-").map(Number);

    const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNumber, 1));

    // Retrieve expenses for this user and month
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.user.userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    // Group expenses by category
    const categoryTotals = {};

    let monthlyTotal = 0;

    for (const expense of expenses) {
      const amount = Number(expense.amount);

      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + amount;

      monthlyTotal += amount;
    }

    const summary = Object.entries(categoryTotals).map(
      ([category, total]) => ({
        category,
        total: total.toFixed(2),
      })
    );

    return res.status(200).json({
      success: true,
      month,
      summary,
      monthlyTotal: monthlyTotal.toFixed(2),
    });
  } catch (error) {
    console.error("Monthly summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};