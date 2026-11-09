import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await signup(formData);

      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please log in." },
      });
    } catch (err) {
      const data = err.response?.data;
      const firstError = Array.isArray(data?.errors) ? data.errors[0] : null;

      setError(
        firstError || data?.message || "Registration failed. Please try again.",
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
        <h1 className="mt-2 text-3xl font-bold">Create account</h1>
        <p className="mt-2">Start managing your expenses today</p>

        {error && (
          <div className="mt-5 rounded-lg bg-ink p-3 text-sm text-cream">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              minLength={2}
              className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink outline-none placeholder:text-ink/60 focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember"
            />
          </div>

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
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full rounded-lg border border-ink/15 bg-cream px-4 py-3 text-ink outline-none placeholder:text-ink/60 focus-visible:border-ember focus-visible:ring-2 focus-visible:ring-ember"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full cursor-pointer rounded-lg bg-ember py-3 font-semibold text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-ember hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
