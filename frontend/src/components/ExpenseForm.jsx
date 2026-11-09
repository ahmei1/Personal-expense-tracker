import { useEffect, useState } from "react";
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
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

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
    <section id="expense-form" className="scroll-mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">
        {existingExpense ? "Edit expense" : "Add expense"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {existingExpense
          ? "Update the fields, then save."
          : "Fill in the details of what you spent."}
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
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
          <label className="mb-2 block text-sm font-medium text-slate-700">
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
            <label className="mb-2 block text-sm font-medium text-slate-700">
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
            <label className="mb-2 block text-sm font-medium text-slate-700">
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
          <label className="mb-2 block text-sm font-medium text-slate-700">
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
          <button
            type="submit"
            disabled={loading}
            className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : existingExpense
                ? "Update expense"
                : "Add expense"}
          </button>

          {existingExpense && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cursor-pointer rounded-lg bg-slate-100 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
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
