import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#FA8112", "#222222"];

const CategoryPieChart = ({ summary }) => {
  if (!summary || summary.length === 0) {
    return (
      <p className="mt-4 text-center text-ink">
        No expense data available to display.
      </p>
    );
  }

  const chartData = summary.map((item) => ({
    category: item.category,
    total: Number(item.total),
  }));

  const total = chartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="mt-6 w-full">
      <h3 className="mb-4 text-lg font-semibold text-ink">
        Spending by Category
      </h3>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ink text-sm font-semibold"
            >
              {total.toFixed(2)}
            </text>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={2}
              stroke="#F5E7C6"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => Number(value).toFixed(2)}
              contentStyle={{
                background: "#222222",
                border: "1px solid #FA8112",
                borderRadius: "8px",
                color: "#FAF3E1",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {chartData.map((item, index) => (
          <li
            key={item.category}
            className="flex items-center gap-2 text-sm text-ink"
          >
            <span
              className="inline-block size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              aria-hidden="true"
            />
            <span>{item.category}</span>
            <span className="font-semibold tabular-nums">
              {item.total.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPieChart;
