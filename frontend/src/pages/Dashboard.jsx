import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-ink text-cream">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <motion.header
          className="flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <Link to="/" className="text-sm font-medium text-ember">
              Personal
            </Link>
            <h1 className="text-2xl font-bold text-cream">
              Expense Tracker
            </h1>
            <p className="mt-1 text-sand">Welcome, {user?.name}</p>
          </div>

          <motion.button
            onClick={logout}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer rounded-lg border border-ember bg-ink px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-ember hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            Logout
          </motion.button>
        </motion.header>

        <motion.div
          className="mt-6 space-y-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
            <MonthlySummary refreshKey={summaryVersion} />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
            <ExpenseForm
              existingExpense={editingExpense}
              onExpenseAdded={handleExpenseAdded}
              onExpenseUpdated={handleExpenseUpdated}
            />
          </motion.div>

          <motion.section
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            className="rounded-2xl bg-sand p-6 text-ink"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  Expenses
                </h2>
                <p className="mt-1 text-sm">
                  {filteredExpenses.length} shown
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter by category"
                className="rounded-lg border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember"
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
                className="rounded-lg border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember"
              />

              <button
                onClick={() => {
                  setFilterCategory("All");
                  setFilterMonth("");
                }}
                className="cursor-pointer rounded-lg bg-cream px-4 py-2.5 text-sm font-medium text-ink transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                Clear filters
              </button>
            </div>

            {loading && (
              <p className="mt-6 text-sm">Loading expenses...</p>
            )}

            {error && (
              <p className="mt-6 rounded-lg bg-ink p-3 text-sm text-cream">
                {error}
              </p>
            )}

            {!loading && !error && expenses.length === 0 && (
              <p className="mt-6 text-sm">
                No expenses yet. Start by adding your first expense.
              </p>
            )}

            {!loading &&
              !error &&
              expenses.length > 0 &&
              filteredExpenses.length === 0 && (
                <p className="mt-6 text-sm">
                  No expenses match these filters.
                </p>
              )}

            {!loading && filteredExpenses.length > 0 && (
              <div className="mt-6 space-y-3">
                <AnimatePresence>
                {filteredExpenses.map((expense) => (
                  <motion.article
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl bg-cream p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">
                          {expense.title}
                        </h3>
                        <p className="mt-1 text-sm">
                          <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-ink">
                            {expense.category}
                          </span>
                          <span className="ml-2">{showDate(expense.date)}</span>
                        </p>
                        {expense.description && (
                          <p className="mt-2 text-sm">
                            {expense.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold tabular-nums">
                          {Number(expense.amount).toFixed(2)}
                        </p>
                        <motion.button
                          onClick={() => startEdit(expense)}
                          whileTap={{ scale: 0.97 }}
                          className="cursor-pointer rounded-lg bg-sand px-3 py-2 text-sm font-medium text-ink transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteExpense(expense.id)}
                          whileTap={{ scale: 0.97 }}
                          disabled={Boolean(deletingId)}
                          className="cursor-pointer rounded-lg bg-ember px-3 py-2 text-sm font-medium text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === expense.id ? "Deleting..." : "Delete"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
