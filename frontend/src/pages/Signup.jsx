import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getApiErrorMessage,
  signupRequest,
  sendEmailOTP,
  verifyEmailOTP,
} from "../services/authService";

export default function Signup() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");

  const handleRoleChange = (role) => {
    setForm((current) => ({
      ...current,
      role,
    }));
  };

  // Send OTP to email
  const handleSendOTP = async () => {
    setError("");

    if (!form.email) {
      setError("Please enter your email address.");
      return;
    }

    setOtpLoading(true);

    try {
      await sendEmailOTP(form.email);
      setOtpSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setOtpLoading(true);

    try {
      const result = await verifyEmailOTP(form.email, otp);

      setVerificationToken(result.verificationToken);
      setEmailVerified(true);
      setOtpSent(false);
      setOtp("");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Email verification is mandatory
    if (!emailVerified || !verificationToken) {
      setError("Please verify your email before creating an account.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create the account
      await signupRequest({
        ...form,
        emailVerificationToken: verificationToken,
      });

      // Registration does not create a session,
      // so log in using the newly created credentials.
      await login({
        email: form.email,
        password: form.password,
        role: form.role,
      });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05050b] px-5 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 futuristic-grid opacity-50" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left side */}
        <div className="hidden lg:block">
          <Link
            to="/"
            className="text-sm font-semibold text-white/50 transition hover:text-white"
          >
            ← Back to Peerly
          </Link>

          <div className="mt-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/60">
              Join the network
            </p>

            <h1 className="mt-5 text-6xl font-black leading-none">
              Learn.
              <br />
              Teach.
              <br />
              <span className="gradient-text">Connect.</span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
              Join Peerly as a learner or become a senior peer tutor
              and help someone else understand what you already know.
            </p>
          </div>
        </div>

        {/* Signup card */}
        <div className="mx-auto w-full max-w-md">
          <div className="glass-strong rounded-[30px] p-7 shadow-2xl sm:p-9">
            <Link
              to="/"
              className="text-lg font-black lg:hidden"
            >
              Peerly
            </Link>

            <div className="mt-8 lg:mt-0">
              <p className="text-[10px] uppercase tracking-[0.25em] text-violet-300/70">
                Create account
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Join Peerly
              </h2>

              <p className="mt-2 text-xs text-white/35">
                Choose how you want to participate.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-300">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              {/* Name */}
              <label className="block">
                <span className="text-xs font-semibold text-white/60">
                  Full Name
                </span>

                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/40 focus:bg-white/[0.06]"
                />
              </label>

              {/* Email */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60">
                    Email
                  </span>

                  {emailVerified && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      ✓ Verified
                    </span>
                  )}
                </div>

                <div className="mt-2 flex gap-2">
                  <input
                    required
                    type="email"
                    value={form.email}
                    disabled={emailVerified}
                    onChange={(e) => {
                      setForm((current) => ({
                        ...current,
                        email: e.target.value,
                      }));

                      // Changing the email invalidates previous verification
                      setEmailVerified(false);
                      setOtpSent(false);
                      setVerificationToken("");
                    }}
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/40 focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {!emailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading || !form.email}
                      className="shrink-0 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {otpLoading ? "Sending..." : "Validate Email"}
                    </button>
                  )}
                </div>

                {/* OTP */}
                {otpSent && !emailVerified && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-white/50">
                      Enter the 6-digit OTP sent to your email.
                    </p>

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        placeholder="000000"
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-bold tracking-[0.3em] text-white outline-none placeholder:text-white/20 focus:border-cyan-400/40"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={otpLoading || otp.length !== 6}
                        className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {otpLoading
                          ? "Verifying..."
                          : "Verify OTP"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Password */}
              <label className="block">
                <span className="text-xs font-semibold text-white/60">
                  Password
                </span>

                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                  placeholder="At least 8 characters"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/40 focus:bg-white/[0.06]"
                />
              </label>

              {/* Role */}
              <fieldset>
                <legend className="text-xs font-semibold text-white/60">
                  Choose your role
                </legend>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Student */}
                  <label
                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      form.role === "student"
                        ? "border-violet-400/60 bg-violet-500/15 shadow-[0_0_30px_rgba(139,92,246,0.12)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={form.role === "student"}
                      onChange={() => handleRoleChange("student")}
                      className="sr-only"
                    />

                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          form.role === "student"
                            ? "border-violet-400"
                            : "border-white/25"
                        }`}
                      >
                        {form.role === "student" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">
                          Student Learner
                        </div>

                        <div className="mt-1 text-[10px] leading-4 text-white/35">
                          I need academic help
                        </div>
                      </div>
                    </div>

                    {form.role === "student" && (
                      <div className="absolute right-3 top-3 text-[8px] font-bold uppercase tracking-wider text-violet-300">
                        Selected
                      </div>
                    )}
                  </label>

                  {/* Tutor */}
                  <label
                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                      form.role === "tutor"
                        ? "border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_30px_rgba(103,232,249,0.08)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="tutor"
                      checked={form.role === "tutor"}
                      onChange={() => handleRoleChange("tutor")}
                      className="sr-only"
                    />

                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          form.role === "tutor"
                            ? "border-cyan-300"
                            : "border-white/25"
                        }`}
                      >
                        {form.role === "tutor" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-white">
                          Senior Peer Tutor
                        </div>

                        <div className="mt-1 text-[10px] leading-4 text-white/35">
                          I want to help others
                        </div>
                      </div>
                    </div>

                    {form.role === "tutor" && (
                      <div className="absolute right-3 top-3 text-[8px] font-bold uppercase tracking-wider text-cyan-300">
                        Selected
                      </div>
                    )}
                  </label>
                </div>
              </fieldset>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !emailVerified}
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating account..."
                  : !emailVerified
                  ? "Verify Email First"
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-xs text-white/30">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-violet-300 transition hover:text-violet-200"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}