import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#64748B",
];

const CategoryPieChart = ({ summary }) => {
  if (!summary || summary.length === 0) {
    return (
      <p className="mt-4 text-center text-gray-500">
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
    <div className="mt-6 h-80 w-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Spending by Category
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-800"
          >
            {total.toFixed(2)}
          </text>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={(value) => Number(value).toFixed(2)} />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
