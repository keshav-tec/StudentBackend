import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    loading,
    isAuthenticated,
    logout,
  } = useAuth();

  // =====================================================
  // NAVIGATION LINKS
  // =====================================================

  const links = [
    ["Home", "#home"],
    ["How It Works", "#how-it-works"],
    ["Tutors", "#tutors"],
    ["About", "#about"],
    ["Contact", "#contact"],
  ];

  // =====================================================
  // GET DASHBOARD PATH
  // =====================================================

  const getDashboardPath = () => {
    if (!user) {
      return "/";
    }

    if (user.role === "student") {
      return "/student-dashboard";
    }

    if (user.role === "tutor") {
      return "/tutor-dashboard";
    }

    if (user.role === "admin") {
      return "/admin-dashboard";
    }

    return "/";
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();

      setOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setOpen(false);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full">

      {/* =================================================
          FULL-WIDTH NAVBAR CONTAINER

          Removed max-w-7xl so the navbar can use the
          complete available viewport width.
      ================================================= */}

      <div className="w-full px-4 pt-5 sm:px-6 lg:px-8 xl:px-12">

        <nav className="glass w-full rounded-2xl px-4 py-3 shadow-2xl shadow-black/20">

          {/* =================================================
              MAIN NAVBAR ROW
          ================================================= */}

          <div className="flex items-center justify-between">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={closeMobileMenu}
            >
              {/* Logo icon */}

              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-violet-300/20 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/40">

                <span className="text-sm font-black text-white">
                  P
                </span>

                {/* Glow */}

                <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-cyan-300/40 blur-md" />

              </div>

              {/* Brand */}

              <div>

                <div className="text-base font-black tracking-tight text-white">
                  Peerly
                </div>

                <div className="hidden text-[8px] uppercase tracking-[0.25em] text-white/40 sm:block">
                  Learn together
                </div>

              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div className="hidden items-center gap-1 md:flex">

              {links.map(([label, href], index) => (
                <a
                  key={label}
                  href={href}
                  className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
                    index === 0
                      ? "bg-white/[0.08] text-white"
                      : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {label}
                </a>
              ))}

            </div>

            {/* =================================================
                DESKTOP AUTH ACTIONS
            ================================================= */}

            <div className="hidden items-center gap-2 md:flex">

              {/* -------------------------------------------------
                  CHECKING AUTHENTICATION
              ------------------------------------------------- */}

              {loading ? (

                <span className="px-4 py-2 text-xs text-white/40">
                  ...
                </span>

              ) : !isAuthenticated ? (

                /* -------------------------------------------------
                   NOT LOGGED IN
                ------------------------------------------------- */

                <>
                  <Link
                    to="/login"
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="group relative overflow-hidden rounded-xl border border-violet-300/20 bg-violet-500/20 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:bg-violet-500/30"
                  >
                    <span className="relative z-10">
                      Get Started
                    </span>

                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Link>
                </>

              ) : (

                /* -------------------------------------------------
                   LOGGED IN
                ------------------------------------------------- */

                <>
                  <Link
                    to={getDashboardPath()}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    Logout
                  </button>
                </>

              )}

            </div>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={open}
            >

              <div className="space-y-1.5">

                <span className="block h-px w-5 bg-white" />
                <span className="block h-px w-5 bg-white" />
                <span className="block h-px w-5 bg-white" />

              </div>

            </button>

          </div>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          {open && (
            <div className="mt-3 border-t border-white/10 pt-3 md:hidden">

              <div className="flex flex-col gap-1">

                {/* -------------------------------------------------
                    MOBILE NAVIGATION LINKS
                ------------------------------------------------- */}

                {links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-3 text-sm text-white/65 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    {label}
                  </a>
                ))}

                {/* -------------------------------------------------
                    MOBILE AUTH
                ------------------------------------------------- */}

                <div className="mt-2 border-t border-white/10 pt-3">

                  {loading ? (

                    <div className="px-4 py-3 text-center text-sm text-white/40">
                      Checking authentication...
                    </div>

                  ) : !isAuthenticated ? (

                    <div className="grid grid-cols-2 gap-2">

                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        Login
                      </Link>

                      <Link
                        to="/signup"
                        onClick={closeMobileMenu}
                        className="rounded-xl bg-violet-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-600"
                      >
                        Get Started
                      </Link>

                    </div>

                  ) : (

                    <div className="flex flex-col gap-2">

                      <Link
                        to={getDashboardPath()}
                        onClick={closeMobileMenu}
                        className="rounded-xl bg-white/[0.06] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                      >
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                      >
                        Logout
                      </button>

                    </div>

                  )}

                </div>

              </div>

            </div>
          )}

        </nav>
      </div>
    </header>
  );
}