import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";
import expenseRoutes from "./routes/expense.routes.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

//middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

//healthcheck
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "pesonal expense tracker API is running",
  });
});

app.get("/api/protected", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route!",
    userId: req.user.userId,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
//start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PORT ${PORT} IS RUNNING!`);
});
