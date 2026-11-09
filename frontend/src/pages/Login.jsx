import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-10 text-cream">
      <motion.div
        className="w-full max-w-md rounded-2xl bg-sand p-8 text-ink"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className="text-sm font-medium text-ember">
          Expense Tracker
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2">Sign in to manage your expenses</p>

        {successMessage && (
          <div className="mt-5 rounded-lg bg-cream p-3 text-sm text-ink">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg bg-ink p-3 text-sm text-cream">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink outline-none placeholder:text-ink/60 focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink outline-none placeholder:text-ink/60 focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full cursor-pointer rounded-lg bg-ember py-3 font-semibold text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-ember hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
