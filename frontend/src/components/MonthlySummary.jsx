import { useEffect, useState } from "react";
import api from "../api/axios";
import { thisMonthString } from "../utils/date";
import CategoryPieChart from "../components/CategoryPieChart";

const MonthlySummary = ({ refreshKey }) => {
  const [month, setMonth] = useState(thisMonthString());
  const [summary, setSummary] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      if (!month) {
        setSummary([]);
        setMonthlyTotal("0.00");
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(`/expenses/summary?month=${month}`);

        setSummary(response.data.summary);
        setMonthlyTotal(response.data.monthlyTotal);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load monthly summary.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [month, refreshKey]);

  const totalNumber = Number(monthlyTotal) || 0;

  return (
    <section className="rounded-2xl bg-sand p-6 text-ink">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Monthly summary
          </h2>
          <p className="mt-1 text-sm">
            Totals for the month you pick
          </p>
        </div>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          aria-label="Summary month"
          className="rounded-lg border border-ink/15 bg-cream px-3 py-2.5 text-ink outline-none focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember"
        />
      </div>

      {loading && (
        <p className="mt-5 text-sm">Loading summary...</p>
      )}

      {error && (
        <p className="mt-5 rounded-lg bg-ink p-3 text-sm text-cream">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="mt-5 rounded-2xl bg-ember p-5 text-ink">
            <p className="text-sm">Total expenses</p>
            <h3 className="mt-1 text-3xl font-bold tabular-nums">
              {totalNumber.toFixed(2)}
            </h3>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">
              By category
            </h3>

            {summary.length === 0 ? (
              <p className="mt-3 text-sm">
                No expenses recorded for this month.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {summary.map((item) => {
                  const width = totalNumber
                    ? (Number(item.total) / totalNumber) * 100
                    : 0;

                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-semibold tabular-nums">
                          {Number(item.total).toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-cream">
                        <div
                          className="h-2 rounded-full bg-ember"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <CategoryPieChart summary={summary} />
        </>
      )}
    </section>
  );
};

export default MonthlySummary;
