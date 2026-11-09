import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ExpenseForm from "../components/ExpenseForm";
import MonthlySummary from "../components/MonthlySummary";
import { dateOnly, showDate } from "../utils/date";

function sortByDate(list) {
  return [...list].sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [summaryVersion, setSummaryVersion] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get("/expenses");
        setExpenses(sortByDate(response.data.expenses));
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const refreshSummary = () => {
    setSummaryVersion((version) => version + 1);
  };

  const handleExpenseUpdated = (updatedExpense) => {
    if (!updatedExpense) {
      setEditingExpense(null);
      return;
    }

    setExpenses((prevExpenses) =>
      sortByDate(
        prevExpenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense,
        ),
      ),
    );

    setEditingExpense(null);
    setError("");
    refreshSummary();
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prev) => sortByDate([newExpense, ...prev]));
    setError("");
    refreshSummary();
  };

  const handleDeleteExpense = async (expenseId) => {
    if (deletingId) return;

    setDeletingId(expenseId);
    setError("");

    try {
      await api.delete(`/expenses/${expenseId}`);

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId),
      );

      if (editingExpense?.id === expenseId) {
        setEditingExpense(null);
      }

      refreshSummary();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (expense) => {
    setEditingExpense(expense);
    document.getElementById("expense-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      filterCategory === "All" || expense.category === filterCategory;

    const matchesMonth =
      filterMonth === "" || dateOnly(expense.date).slice(0, 7) === filterMonth;

    return matchesCategory && matchesMonth;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700">Personal</p>
            <h1 className="text-2xl font-bold text-slate-900">
              Expense Tracker
            </h1>
            <p className="mt-1 text-slate-600">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="cursor-pointer rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-red-50"
          >
            Logout
          </button>
        </header>

        <div className="mt-6 space-y-6">
          <MonthlySummary refreshKey={summaryVersion} />

          <ExpenseForm
            existingExpense={editingExpense}
            onExpenseAdded={handleExpenseAdded}
            onExpenseUpdated={handleExpenseUpdated}
          />

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Expenses
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredExpenses.length} shown
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter by category"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                aria-label="Filter by month"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                onClick={() => {
                  setFilterCategory("All");
                  setFilterMonth("");
                }}
                className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Clear filters
              </button>
            </div>

            {loading && (
              <p className="mt-6 text-sm text-slate-500">Loading expenses...</p>
            )}

            {error && (
              <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {!loading && !error && expenses.length === 0 && (
              <p className="mt-6 text-sm text-slate-500">
                No expenses yet. Start by adding your first expense.
              </p>
            )}

            {!loading &&
              !error &&
              expenses.length > 0 &&
              filteredExpenses.length === 0 && (
                <p className="mt-6 text-sm text-slate-500">
                  No expenses match these filters.
                </p>
              )}

            {!loading && filteredExpenses.length > 0 && (
              <div className="mt-6 space-y-3">
                {filteredExpenses.map((expense) => (
                  <article
                    key={expense.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {expense.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {expense.category}
                          </span>
                          <span className="ml-2">{showDate(expense.date)}</span>
                        </p>
                        {expense.description && (
                          <p className="mt-2 text-sm text-slate-600">
                            {expense.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold tabular-nums text-slate-900">
                          {Number(expense.amount).toFixed(2)}
                        </p>
                        <button
                          onClick={() => startEdit(expense)}
                          className="cursor-pointer rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          disabled={Boolean(deletingId)}
                          className="cursor-pointer rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === expense.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
