import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
} from "../controllers/expense.controller.js";

const router = Router();

router.post("/", authenticate, createExpense);
router.get("/", authenticate, getExpenses);
router.put("/:id", authenticate, updateExpense);
router.delete("/:id", authenticate, deleteExpense);
router.get("/summary", authenticate, getMonthlySummary);

export default router;
