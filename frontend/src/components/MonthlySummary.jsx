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
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Monthly summary
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Totals for the month you pick
          </p>
        </div>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          aria-label="Summary month"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {loading && (
        <p className="mt-5 text-sm text-slate-500">Loading summary...</p>
      )}

      {error && (
        <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="mt-5 rounded-2xl bg-blue-600 p-5 text-white">
            <p className="text-sm text-blue-100">Total expenses</p>
            <h3 className="mt-1 text-3xl font-bold tabular-nums">
              {totalNumber.toFixed(2)}
            </h3>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              By category
            </h3>

            {summary.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
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
                        <span className="text-slate-600">{item.category}</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          {Number(item.total).toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
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
