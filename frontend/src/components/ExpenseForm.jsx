import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { dateOnly, todayString } from "../utils/date";

const getInitialFormData = () => ({
  title: "",
  description: "",
  amount: "",
  category: "",
  date: todayString(),
});

const fieldClass =
  "w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink outline-none placeholder:text-ink/60 focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember";

const ExpenseForm = ({
  onExpenseAdded,
  existingExpense,
  onExpenseUpdated,
}) => {
  const [formData, setFormData] = useState(getInitialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingExpense) {
      setFormData({
        title: existingExpense.title,
        description: existingExpense.description || "",
        amount: String(existingExpense.amount),
        category: existingExpense.category,
        date: dateOnly(existingExpense.date),
      });
    } else {
      setFormData(getInitialFormData());
    }

    setError("");
  }, [existingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const expenseData = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (existingExpense) {
        const response = await api.put(
          `/expenses/${existingExpense.id}`,
          expenseData,
        );

        onExpenseUpdated(response.data.expense);
      } else {
        const response = await api.post("/expenses", expenseData);

        onExpenseAdded(response.data.expense);
      }

      setFormData(getInitialFormData());
    } catch (err) {
      const data = err.response?.data;
      const firstError = Array.isArray(data?.errors) ? data.errors[0] : null;

      setError(
        firstError ||
          data?.message ||
          (existingExpense
            ? "Failed to update expense."
            : "Failed to add expense."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(getInitialFormData());
    setError("");

    if (existingExpense) {
      onExpenseUpdated(null);
    }
  };

  return (
    <section id="expense-form" className="scroll-mt-6 rounded-2xl bg-sand p-6 text-ink">
      <h2 className="text-lg font-semibold">
        {existingExpense ? "Edit expense" : "Add expense"}
      </h2>
      <p className="mt-1 text-sm">
        {existingExpense
          ? "Update the fields, then save."
          : "Fill in the details of what you spent."}
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-ink p-3 text-sm text-cream">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Title
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Coffee, rent, groceries..."
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional note"
            rows={3}
            className={fieldClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Amount
            </label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Date
            </label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={fieldClass}
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex gap-3">
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="flex-1 cursor-pointer rounded-lg bg-ember px-4 py-3 font-medium text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : existingExpense
                ? "Update expense"
                : "Add expense"}
          </motion.button>

          {existingExpense && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cursor-pointer rounded-lg bg-cream px-5 py-3 font-medium text-ink transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ExpenseForm;
