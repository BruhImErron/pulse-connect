import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import HeartLogo from "@/components/HeartLogo";

const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grain-overlay flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-center mb-8">
          <Link to="/">
            <HeartLogo size={36} />
          </Link>
        </div>

        <div className="glass-card p-8">
          {/* Mode toggle */}
          <div className="flex gap-1 mb-6 bg-secondary rounded-xl p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  mode === m
                    ? "bg-card text-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMode(m)}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none"
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none"
                placeholder={
                  mode === "register" ? "Min. 8 characters" : "••••••••"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <motion.button
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;