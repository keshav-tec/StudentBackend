import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  BookOpen,
  CalendarDays,
  MessageCircle,
  Star,
  LogOut,
  Users,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  BrainCircuit,
  CircleDot,
  ChevronRight,
  GraduationCap,
  Zap,
  UserRound,
} from "lucide-react";

import {
  getStudentProfile,
  getMyTutorProfile,
  getDoubts,
  getBookings,
} from "../services/api";

export default function TutorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(user || null);
  const [tutorProfile, setTutorProfile] = useState(null);

  const [doubts, setDoubts] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH DASHBOARD DATA
  // ==================================================

  const fetchDashboardData = async () => {
    try {
      setError("");

      // ----------------------------------------------
      // USER PROFILE
      // ----------------------------------------------

      const profileResponse = await getStudentProfile();

      const profile =
        profileResponse?.data ||
        user ||
        null;

      if (profile) {
        setTutor(profile);
      }

      // ----------------------------------------------
      // DOUBTS / BOOKINGS / TUTOR PROFILE
      // ----------------------------------------------

      const [
        doubtsResponse,
        bookingsResponse,
        tutorResponse,
      ] = await Promise.allSettled([
        getDoubts(),
        getBookings(),
        getMyTutorProfile(),
      ]);

      // ----------------------------------------------
      // DOUBTS
      // ----------------------------------------------

      if (
        doubtsResponse.status === "fulfilled" &&
        doubtsResponse.value?.success
      ) {
        setDoubts(
          Array.isArray(doubtsResponse.value.data)
            ? doubtsResponse.value.data
            : []
        );
      } else {
        setDoubts([]);
      }

      // ----------------------------------------------
      // BOOKINGS
      // ----------------------------------------------

      if (
        bookingsResponse.status === "fulfilled" &&
        bookingsResponse.value?.success
      ) {
        const bookingData =
          bookingsResponse.value.data;

        if (Array.isArray(bookingData)) {
          setBookings(bookingData);
        } else {
          setBookings(
            Array.isArray(
              bookingData?.bookings
            )
              ? bookingData.bookings
              : []
          );
        }
      } else {
        setBookings([]);
      }

      // ----------------------------------------------
      // TUTOR PROFILE
      // ----------------------------------------------

      if (
        tutorResponse.status === "fulfilled" &&
        tutorResponse.value?.success
      ) {
        setTutorProfile(
          tutorResponse.value.data || null
        );
      } else {
        setTutorProfile(null);

        if (
          tutorResponse.status ===
          "rejected"
        ) {
          console.error(
            "Tutor profile request failed:",
            tutorResponse.reason
          );
        }
      }
    } catch (err) {
      console.error(
        "Tutor dashboard error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load tutor dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  // ==================================================
  // STATISTICS
  // ==================================================

  const completedBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        booking.status === "completed"
    );
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    return bookings
      .filter(
        (booking) =>
          booking.status === "pending" ||
          booking.status === "confirmed"
      )
      .sort((a, b) => {
        const dateA = new Date(
          `${a.date || ""} ${a.startTime || ""}`
        );

        const dateB = new Date(
          `${b.date || ""} ${b.startTime || ""}`
        );

        return dateA - dateB;
      });
  }, [bookings]);

  const answeredDoubts = useMemo(() => {
    return doubts.filter((doubt) =>
      [
        "matched",
        "booked",
        "resolved",
        "closed",
      ].includes(doubt.status)
    );
  }, [doubts]);

  // ==================================================
  // TUTOR SPECIALIZATIONS
  // ==================================================

  const tutorSubjects = useMemo(() => {
    if (
      Array.isArray(
        tutorProfile?.subjects
      )
    ) {
      return tutorProfile.subjects.filter(
        Boolean
      );
    }

    return [];
  }, [tutorProfile]);

  const subjectCount =
    tutorSubjects.length ||
    new Set(
      doubts
        .map((doubt) => doubt.subject)
        .filter(Boolean)
    ).size;

  // ==================================================
  // RATING
  // ==================================================

  const rating =
    tutorProfile?.rating ??
    tutor?.rating ??
    null;

  // ==================================================
  // TUTOR NAME
  // ==================================================

  const tutorName =
    tutor?.name ||
    tutorProfile?.userId?.name ||
    user?.name ||
    "Tutor";

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05050b] text-white">
        <div className="absolute inset-0 futuristic-grid" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-violet-300/20 bg-violet-500/10 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <RefreshCw
              size={25}
              className="animate-spin text-cyan-300"
            />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">
            Initializing tutor console
          </p>

          <p className="mt-2 text-sm text-white/25">
            Connecting to the peer learning network...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05050b] text-white">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 futuristic-grid" />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[15%] top-[10%] h-[420px] w-[420px] rounded-full bg-violet-600/[0.07] blur-[130px]" />

        <div className="absolute right-[-100px] top-[20%] h-[450px] w-[450px] rounded-full bg-cyan-500/[0.06] blur-[130px]" />

        <div className="absolute bottom-[-150px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/[0.06] blur-[140px]" />
      </div>

      {/* ==================================================
          TOP NAVIGATION
      ================================================== */}

      <header className="relative z-20 border-b border-white/[0.07] bg-[#05050b]/75 backdrop-blur-2xl">
        <div className="flex h-[74px] items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* BRAND */}

          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-[0_0_30px_rgba(139,92,246,0.12)]">
              <BookOpen
                size={18}
                className="text-cyan-300"
              />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight">
                PEERLY
              </div>

              <div className="hidden text-[8px] uppercase tracking-[0.3em] text-white/25 sm:block">
                Knowledge exchange
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2 sm:gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-300/[0.03] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-200/55">
                Tutor online
              </span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/45 transition hover:border-cyan-300/20 hover:bg-white/[0.06] hover:text-cyan-300 disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

            <button
              onClick={handleLogout}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/35 transition hover:border-red-400/20 hover:bg-red-500/[0.06] hover:text-red-300"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="relative z-10 w-full px-5 pb-20 pt-10 sm:px-8 lg:px-12 xl:px-16">

        {/* ==================================================
            HERO / WELCOME
        ================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] px-6 py-8 backdrop-blur-xl sm:px-9 sm:py-10 lg:px-12">

          <div className="pointer-events-none absolute right-[-80px] top-[-120px] h-[320px] w-[320px] rounded-full bg-violet-500/10 blur-[100px]" />

          <div className="pointer-events-none absolute bottom-[-120px] left-[30%] h-[250px] w-[250px] rounded-full bg-cyan-400/[0.05] blur-[100px]" />

          <div className="relative">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

              {/* TEXT */}

              <div className="max-w-3xl">

                <div className="mb-5 flex items-center gap-2">
                  <Sparkles
                    size={13}
                    className="text-cyan-300"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-300/60">
                    Tutor console / active
                  </span>
                </div>

                <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Welcome back,
                  <br />
                  <span className="gradient-text">
                    {tutorName}.
                  </span>
                </h1>

                {/* EDIT PROFILE */}

                <button
                  onClick={() =>
                    navigate("/tutor-profile")
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-300/15 bg-violet-500/[0.07] px-4 py-2.5 text-xs font-semibold text-violet-200/80 transition hover:border-violet-300/25 hover:bg-violet-500/[0.12] hover:text-violet-100"
                >
                  <UserRound size={16} />
                  Edit Profile
                </button>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                  Your knowledge is part of the Peerly
                  network. Help students understand
                  difficult concepts, solve doubts, and
                  turn questions into clarity.
                </p>
              </div>

              {/* KNOWLEDGE CORE */}

              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-violet-300/15 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.16),rgba(139,92,246,0.12)_40%,rgba(8,8,18,0.95)_72%)] shadow-[0_0_70px_rgba(139,92,246,0.15)]">

                  <div className="absolute h-24 w-24 rounded-full border border-cyan-300/10 bg-cyan-300/[0.025]" />

                  <div className="relative text-center">
                    <BrainCircuit
                      size={21}
                      className="mx-auto text-cyan-300/80"
                    />

                    <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.25em] text-white/35">
                      Knowledge
                    </div>

                    <div className="mt-1 text-[8px] uppercase tracking-[0.2em] text-cyan-300/45">
                      Core
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SPECIALIZATIONS */}

            <div className="mt-8 border-t border-white/[0.06] pt-6">

              <div className="mb-3 flex items-center gap-2">
                <GraduationCap
                  size={14}
                  className="text-violet-300"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
                  Your specializations
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {tutorSubjects.length > 0 ? (
                  tutorSubjects.map(
                    (subject) => (
                      <span
                        key={subject}
                        className="rounded-full border border-violet-300/15 bg-violet-500/[0.07] px-3 py-1.5 text-[10px] font-semibold text-violet-200/75"
                      >
                        {subject}
                      </span>
                    )
                  )
                ) : (
                  <span className="text-xs text-white/25">
                    No specializations configured yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-4 text-sm text-red-300">
            <AlertCircle
              size={18}
              className="shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* ==================================================
            STATS
        ================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Stat
            icon={MessageCircle}
            label="Network activity"
            title="Doubts answered"
            value={answeredDoubts.length}
            accent="violet"
          />

          <Stat
            icon={CalendarDays}
            label="Knowledge sessions"
            title="Completed"
            value={completedBookings.length}
            accent="cyan"
          />

          <Stat
            icon={Star}
            label="Student feedback"
            title="Tutor rating"
            value={
              rating !== null
                ? Number(rating).toFixed(1)
                : "—"
            }
            accent="amber"
          />

          <Stat
            icon={BookOpen}
            label="Expertise"
            title="Subjects"
            value={subjectCount}
            accent="violet"
          />
        </section>

        {/* ==================================================
            CONTENT GRID
        ================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">

          {/* ==================================================
              STUDENT DOUBTS
          ================================================== */}

          <div className="glass-strong overflow-hidden rounded-[28px]">

            <div className="border-b border-white/[0.06] p-6 sm:p-7">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/10">
                      <MessageCircle
                        size={15}
                        className="text-violet-300"
                      />
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-violet-300/60">
                      AI routed requests
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-black tracking-tight">
                    Student doubts
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Questions matched to the peer-learning network.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-cyan-300/10 bg-cyan-300/[0.03] px-3 py-1.5">

                  <Users
                    size={13}
                    className="text-cyan-300"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200/55">
                    {doubts.length} requests
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">

              {doubts.length === 0 ? (
                <EmptyState
                  icon={MessageCircle}
                  title="No student doubts yet"
                  description="New questions routed to your expertise will appear here."
                />
              ) : (
                <div className="space-y-3">

                  {doubts.map(
                    (doubt, index) => (
                      <div
                        key={doubt._id}
                        className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/20 hover:bg-white/[0.035]"
                      >

                        <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-32 w-32 rounded-full bg-violet-500/[0.07] opacity-0 blur-3xl transition group-hover:opacity-100" />

                        <div className="relative">

                          <div className="flex flex-col gap-4">

                            <div className="flex items-start justify-between gap-4">

                              <div className="flex min-w-0 items-center gap-3">

                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-[10px] font-black text-violet-200">
                                  {String(
                                    index + 1
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                                </div>

                                <div className="min-w-0">

                                  <p className="truncate text-sm font-bold text-white/80">
                                    {doubt.studentId?.name ||
                                      "Student"}
                                  </p>

                                  <div className="mt-1 flex items-center gap-2">

                                    <span className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                                      {doubt.inputType ===
                                      "voice"
                                        ? "Voice request"
                                        : "Text request"}
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-white/20" />

                                    <span className="text-[9px] uppercase tracking-[0.16em] text-cyan-300/45">
                                      AI analyzed
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <StatusBadge
                                status={
                                  doubt.status
                                }
                              />
                            </div>

                            <p className="line-clamp-2 text-sm leading-6 text-white/50">
                              {doubt.question ||
                                doubt.speechToText
                                  ?.transcript ||
                                "Question unavailable"}
                            </p>

                            <div className="flex flex-wrap items-center gap-2">

                              {doubt.subject && (
                                <span className="rounded-full border border-violet-300/15 bg-violet-500/[0.07] px-2.5 py-1 text-[9px] font-semibold text-violet-200/70">
                                  {doubt.subject}
                                </span>
                              )}

                              {doubt.topic && (
                                <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.04] px-2.5 py-1 text-[9px] font-semibold text-cyan-200/60">
                                  {doubt.topic}
                                </span>
                              )}

                              {doubt.difficulty && (
                                <span className="rounded-full border border-amber-300/10 bg-amber-300/[0.04] px-2.5 py-1 text-[9px] font-semibold uppercase text-amber-200/55">
                                  {doubt.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              UPCOMING SESSIONS
          ================================================== */}

          <div className="glass-strong overflow-hidden rounded-[28px]">

            <div className="border-b border-white/[0.06] p-6 sm:p-7">

              <div className="flex items-center gap-2">

                <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400/10">
                  <CalendarDays
                    size={15}
                    className="text-cyan-300"
                  />
                </div>

                <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-300/60">
                  Live schedule
                </span>
              </div>

              <h2 className="mt-3 text-xl font-black tracking-tight">
                Upcoming sessions
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Your next peer-learning connections.
              </p>
            </div>

            <div className="p-4 sm:p-6">

              {upcomingBookings.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No upcoming sessions"
                  description="Confirmed student bookings will appear here."
                />
              ) : (
                <div className="space-y-3">

                  {upcomingBookings.map(
                    (booking) => (
                      <div
                        key={booking._id}
                        className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition duration-300 hover:border-cyan-300/15 hover:bg-white/[0.035]"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <div className="flex items-center gap-2">

                              <CircleDot
                                size={11}
                                className="text-cyan-300"
                              />

                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300/55">
                                {booking.status ===
                                "confirmed"
                                  ? "Confirmed"
                                  : "Pending"}
                              </span>
                            </div>

                            <h3 className="mt-3 text-sm font-bold text-white/80">
                              {booking.doubtId?.subject ||
                                booking.subject ||
                                "Tutoring Session"}
                            </h3>

                            <p className="mt-1 text-xs text-white/30">
                              Student:{" "}
                              {booking.studentId?.name ||
                                "Student"}
                            </p>
                          </div>

                          <ArrowUpRight
                            size={16}
                            className="text-white/20 transition group-hover:text-cyan-300"
                          />
                        </div>

                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.05] bg-black/20 px-3 py-2.5">

                          <Clock
                            size={14}
                            className="text-cyan-300/70"
                          />

                          <span className="text-[10px] text-white/45">
                            {formatBookingDate(
                              booking.date
                            )}

                            {booking.startTime &&
                              ` · ${booking.startTime}`}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            BOTTOM KNOWLEDGE PANEL
        ================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

          {/* RATING */}

          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-xl">

            <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-amber-400/[0.06] blur-[70px]" />

            <div className="relative">

              <div className="flex items-center gap-2">

                <Star
                  size={14}
                  className="fill-amber-300 text-amber-300"
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-amber-200/55">
                  Student feedback
                </span>
              </div>

              <div className="mt-6 flex items-end gap-3">

                <span className="text-5xl font-black tracking-tight">
                  {rating !== null
                    ? Number(
                        rating
                      ).toFixed(1)
                    : "—"}
                </span>

                <span className="pb-2 text-xs text-white/25">
                  / 5.0
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-white/30">
                Your rating reflects how students
                experience your peer-learning sessions.
              </p>

              <div className="mt-6 flex gap-1">

                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <Star
                      key={item}
                      size={13}
                      className={
                        rating &&
                        item <=
                          Math.round(
                            Number(rating)
                          )
                          ? "fill-amber-300 text-amber-300"
                          : "text-white/10"
                      }
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* KNOWLEDGE NETWORK */}

          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-xl">

            <div className="absolute bottom-[-100px] right-[10%] h-60 w-60 rounded-full bg-violet-500/[0.07] blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <Zap
                    size={14}
                    className="text-violet-300"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-violet-300/55">
                    Knowledge network
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight">
                  Keep the network moving.
                </h3>

                <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                  Every doubt you solve helps another
                  student move one step closer to
                  understanding.
                </p>
              </div>

              <div className="shrink-0">

                <div className="flex items-center gap-3 rounded-2xl border border-violet-300/10 bg-violet-500/[0.04] px-5 py-4">

                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10">

                    <BrainCircuit
                      size={18}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>

                    <div className="text-lg font-black">
                      {completedBookings.length}
                    </div>

                    <div className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                      Sessions completed
                    </div>
                  </div>

                  <ChevronRight
                    size={15}
                    className="text-white/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ==================================================
// STAT
// ==================================================

function Stat({
  icon: Icon,
  label,
  title,
  value,
  accent = "violet",
}) {
  const accentClasses = {
    violet: {
      icon: "text-violet-300",
      bg: "bg-violet-500/[0.08]",
      border: "border-violet-300/10",
    },

    cyan: {
      icon: "text-cyan-300",
      bg: "bg-cyan-400/[0.06]",
      border: "border-cyan-300/10",
    },

    amber: {
      icon: "text-amber-300",
      bg: "bg-amber-400/[0.06]",
      border: "border-amber-300/10",
    },
  };

  const theme =
    accentClasses[accent] ||
    accentClasses.violet;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${theme.border} bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.04]`}
    >
      <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-violet-500/[0.05] blur-2xl transition group-hover:bg-violet-500/[0.09]" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div
            className={`grid h-9 w-9 place-items-center rounded-xl ${theme.bg}`}
          >
            <Icon
              size={16}
              className={theme.icon}
            />
          </div>

          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">
            {label}
          </span>
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
          {title}
        </p>

        <p className="mt-1 text-3xl font-black tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

// ==================================================
// EMPTY STATE
// ==================================================

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-12 text-center">

      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">

        <Icon
          size={20}
          className="text-white/20"
        />
      </div>

      <p className="mt-4 text-sm font-semibold text-white/55">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/25">
        {description}
      </p>
    </div>
  );
}

// ==================================================
// STATUS BADGE
// ==================================================

function StatusBadge({ status }) {
  const normalizedStatus =
    status?.toLowerCase() ||
    "pending";

  const statusConfig = {
    pending: {
      label: "Pending",
      className:
        "border-amber-300/10 bg-amber-300/[0.05] text-amber-200/65",
    },

    transcribing: {
      label: "Transcribing",
      className:
        "border-violet-300/10 bg-violet-400/[0.05] text-violet-200/65",
    },

    ai_processing: {
      label: "AI Processing",
      className:
        "border-violet-300/10 bg-violet-400/[0.05] text-violet-200/65",
    },

    validated: {
      label: "Validated",
      className:
        "border-cyan-300/10 bg-cyan-300/[0.05] text-cyan-200/65",
    },

    matched: {
      label: "Matched",
      className:
        "border-cyan-300/10 bg-cyan-300/[0.05] text-cyan-200/65",
    },

    booked: {
      label: "Booked",
      className:
        "border-violet-300/10 bg-violet-400/[0.05] text-violet-200/65",
    },

    resolved: {
      label: "Resolved",
      className:
        "border-green-300/10 bg-green-300/[0.05] text-green-200/65",
    },

    closed: {
      label: "Closed",
      className:
        "border-white/[0.08] bg-white/[0.03] text-white/40",
    },

    completed: {
      label: "Completed",
      className:
        "border-green-300/10 bg-green-300/[0.05] text-green-200/65",
    },

    confirmed: {
      label: "Confirmed",
      className:
        "border-cyan-300/10 bg-cyan-300/[0.05] text-cyan-200/65",
    },

    cancelled: {
      label: "Cancelled",
      className:
        "border-red-300/10 bg-red-400/[0.05] text-red-200/60",
    },

    rejected: {
      label: "Rejected",
      className:
        "border-red-300/10 bg-red-400/[0.05] text-red-200/60",
    },

    ai_failed: {
      label: "AI Failed",
      className:
        "border-red-300/10 bg-red-400/[0.05] text-red-200/60",
    },
  };

  const config =
    statusConfig[normalizedStatus] || {
      label: status || "Pending",
      className:
        "border-white/[0.08] bg-white/[0.03] text-white/40",
    };

  const completedStates = [
    "completed",
    "resolved",
    "validated",
  ];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] ${config.className}`}
    >
      {completedStates.includes(
        normalizedStatus
      ) && <CheckCircle size={10} />}

      {config.label}
    </span>
  );
}

// ==================================================
// DATE FORMATTER
// ==================================================

function formatBookingDate(date) {
  if (!date) {
    return "Date not specified";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}