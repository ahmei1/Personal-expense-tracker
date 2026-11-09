import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

function MotionLink({ to, className, children }) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-flex">
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

const features = [
  {
    title: "Record spending",
    text: "Save a title, amount, category, and date for each expense.",
  },
  {
    title: "Review the month",
    text: "Filter by category and see how much each month added up to.",
  },
  {
    title: "Keep it private",
    text: "Your account only shows the expenses that belong to you.",
  },
];

const primaryButton =
  "rounded-lg bg-ember px-5 py-3 font-semibold text-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember";

const Landing = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-ink text-cream">
      <motion.header
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to="/"
          className="whitespace-nowrap text-sm font-semibold tracking-wide text-cream"
        >
          Expense Tracker
        </Link>
        <nav className="flex items-center gap-2">
          {!loading && isAuthenticated ? (
            <MotionLink to="/dashboard" className={`${primaryButton} px-4 py-2.5 text-sm`}>
              Dashboard
            </MotionLink>
          ) : (
            <>
              <Link
                to="/login"
                className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-sand hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                Sign in
              </Link>
              <MotionLink
                to="/signup"
                className={`${primaryButton} whitespace-nowrap px-4 py-2.5 text-sm`}
              >
                Create account
              </MotionLink>
            </>
          )}
        </nav>
      </motion.header>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        <motion.section
          className="py-12 sm:py-20"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-ember">
            Personal spending
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-cream sm:text-5xl"
          >
            Keep track of what you spend
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-lg leading-relaxed text-sand">
            A simple place to record expenses, filter them, and see the total
            for each month.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            {!loading && isAuthenticated ? (
              <MotionLink to="/dashboard" className={primaryButton}>
                Open dashboard
              </MotionLink>
            ) : (
              <>
                <MotionLink to="/signup" className={primaryButton}>
                  Get started
                </MotionLink>
                <Link
                  to="/login"
                  className="rounded-lg border border-sand px-5 py-3 font-semibold text-cream transition hover:bg-sand hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                >
                  Sign in
                </Link>
              </>
            )}
          </motion.div>
        </motion.section>

        <motion.section
          aria-label="Features"
          className="grid gap-4 sm:grid-cols-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-sand p-5 text-ink"
            >
              <h2 className="text-base font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed">{feature.text}</p>
            </motion.article>
          ))}
        </motion.section>

        <motion.section
          className="mt-12 rounded-2xl bg-sand px-6 py-8 text-ink sm:flex sm:items-center sm:justify-between sm:gap-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div>
            <h2 className="text-xl font-semibold">Start with one expense</h2>
            <p className="mt-2 text-sm">
              Create an account, then add what you spent today.
            </p>
          </div>
          {(loading || !isAuthenticated) && (
            <MotionLink
              to="/signup"
              className={`${primaryButton} mt-5 sm:mt-0`}
            >
              Create account
            </MotionLink>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default Landing;
