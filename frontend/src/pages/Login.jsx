import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error while user is correcting the form
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const data = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const loggedInRole = data?.user?.role;

      switch (loggedInRole) {
        case "student":
          navigate("/student-dashboard", { replace: true });
          break;

        case "tutor":
          navigate("/tutor-dashboard", { replace: true });
          break;

        case "admin":
          navigate("/admin-dashboard", { replace: true });
          break;

        default:
          setError("Invalid user role. Please contact the administrator.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to login. Please check your credentials and try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050b] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-400">
            Login to your Peerly account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d0d16] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-white/10 bg-[#151522] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-lg border border-white/10 bg-[#151522] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 disabled:opacity-60"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}