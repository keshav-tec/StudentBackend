import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  BookOpen,
  GraduationCap,
  Users,
} from "lucide-react";

import {
  signupRequest,
  getApiErrorMessage,
} from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!["student", "tutor"].includes(form.role)) {
      setError("Please select a valid role.");
      return;
    }

    setLoading(true);

    try {
      const result = await signupRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setSuccess(
        result?.message ||
          "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Registration failed. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center px-4">

        <div className="w-full">

          {/* LOGO */}
          <div className="mb-7 flex items-center justify-center gap-2">
            <BookOpen
              size={28}
              className="text-indigo-600"
            />

            <span className="text-2xl font-bold text-slate-800">
              PeerConnect
            </span>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-xl sm:p-9">

            {/* HEADER */}
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold text-slate-800">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Join the peer learning community.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  I want to join as
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* STUDENT */}
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "role",
                        "student"
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      form.role === "student"
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <GraduationCap
                      size={23}
                      className={
                        form.role === "student"
                          ? "text-indigo-600"
                          : "text-slate-400"
                      }
                    />

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      Student Learner
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Ask doubts & learn
                    </p>
                  </button>

                  {/* TUTOR */}
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "role",
                        "tutor"
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      form.role === "tutor"
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Users
                      size={23}
                      className={
                        form.role === "tutor"
                          ? "text-indigo-600"
                          : "text-slate-400"
                      }
                    />

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      Senior Peer Tutor
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Help & teach peers
                    </p>
                  </button>

                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    updateField(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm password
                </label>

                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  placeholder="Repeat your password"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus size={18} />

                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>

            </form>

            {/* LOGIN LINK */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}