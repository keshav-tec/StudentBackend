import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MessageCircleQuestion,
  Users,
  CalendarDays,
  Coins,
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Zap,
  Clock3,
  BookOpen,
  Star,
  ChevronRight,
  GraduationCap,
  Target,
  CircleDot,
  RefreshCw,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import DoubtTable from "../components/student/DoubtTable";
import TutorCard from "../components/student/TutorCard";
import BookingCard from "../components/student/BookingCard";

import {
  getStudentProfile,
  getTutors,
  getDoubts,
  getBookings,
  bookTutor,
} from "../services/api";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [student, setStudent] = useState(user || null);
  const [tutors, setTutors] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeSection, setActiveSection] =
    useState("overview");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const [
          profileResponse,
          tutorsResponse,
          doubtsResponse,
          bookingsResponse,
        ] = await Promise.all([
          getStudentProfile(),
          getTutors(),
          getDoubts(),
          getBookings(),
        ]);

        if (!mounted) return;

        setStudent(
          profileResponse?.data ||
            user ||
            null
        );

        setTutors(
          tutorsResponse?.data || []
        );

        setDoubts(
          doubtsResponse?.data || []
        );

        setBookings(
          bookingsResponse?.data?.bookings || []
        );
      } catch (error) {
        console.error(
          "Dashboard loading failed:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [user]);

  async function refreshDashboard() {
    try {
      setRefreshing(true);

      const [
        profileResponse,
        tutorsResponse,
        doubtsResponse,
        bookingsResponse,
      ] = await Promise.all([
        getStudentProfile(),
        getTutors(),
        getDoubts(),
        getBookings(),
      ]);

      setStudent(
        profileResponse?.data ||
          user ||
          null
      );

      setTutors(
        tutorsResponse?.data || []
      );

      setDoubts(
        doubtsResponse?.data || []
      );

      setBookings(
        bookingsResponse?.data?.bookings || []
      );
    } catch (error) {
      console.error(
        "Dashboard refresh failed:",
        error
      );
    } finally {
      setRefreshing(false);
    }
  }

  const handleBookTutor = async (tutor) => {
    try {
      const response = await bookTutor(
        tutor.id || tutor._id
      );

      if (response?.success) {
        const booking =
          response.data?.booking ||
          response.data;

        if (booking) {
          setBookings((previous) => [
            booking,
            ...previous,
          ]);
        }

        alert(
          response.message ||
            "Tutor booked successfully."
        );
      }
    } catch (error) {
      console.error(
        "Tutor booking failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to book tutor."
      );
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const initials = useMemo(() => {
    return (
      student?.name
        ?.split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ||
      "ST"
    );
  }, [student?.name]);

  const recentDoubts = useMemo(() => {
    return doubts.slice(0, 3);
  }, [doubts]);

  const upcomingBookings = useMemo(() => {
    return bookings.slice(0, 3);
  }, [bookings]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05050b] text-white">
        <div className="futuristic-grid absolute inset-0 opacity-40" />

        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
          </div>

          <p className="mt-5 text-sm font-medium tracking-wide text-white/50">
            INITIALIZING YOUR LEARNING SPACE
          </p>

          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-400/60">
            PEERLY NETWORK
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05050b] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="futuristic-grid absolute inset-0 opacity-40" />

        <div className="absolute left-[8%] top-[8%] h-96 w-96 rounded-full bg-violet-700/15 blur-[140px]" />

        <div className="absolute right-[5%] top-[18%] h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <div className="relative z-30">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onLogout={handleLogout}
        />
      </div>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="relative z-10 lg:pl-64">
        {/* ===================================================
            TOPBAR
        ==================================================== */}

        <div className="border-b border-white/[0.06] bg-[#05050b]/80 backdrop-blur-xl">
          <Topbar
            student={student || user}
            onMenuClick={() =>
              setMobileOpen(true)
            }
          />
        </div>

        <main className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-6 lg:p-8">
          {/* =================================================
              OVERVIEW
          ================================================== */}

          {activeSection === "overview" && (
            <>
              {/* =================================================
                  HEADER STRIP
              ================================================== */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/80">
                      STUDENT COMMAND CENTER
                    </span>
                  </div>

                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                    Learning{" "}
                    <span className="bg-gradient-to-r from-violet-300 via-white to-cyan-300 bg-clip-text text-transparent">
                      Network
                    </span>
                  </h1>
                </div>

                <button
                  onClick={refreshDashboard}
                  disabled={refreshing}
                  className="group flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/65 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={
                      refreshing
                        ? "animate-spin"
                        : "transition-transform group-hover:rotate-180"
                    }
                  />

                  {refreshing
                    ? "Syncing..."
                    : "Refresh"}
                </button>
              </div>

              {/* =================================================
                  HERO
              ================================================== */}

              <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-2xl sm:p-8 lg:p-10">
                <div className="absolute right-[-100px] top-[-120px] h-80 w-80 rounded-full bg-violet-600/15 blur-[100px]" />

                <div className="absolute bottom-[-120px] right-[20%] h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />

                <div className="relative grid gap-10 lg:grid-cols-[1fr_300px] lg:items-center">
                  {/* LEFT */}

                  <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 backdrop-blur-xl">
                      <Sparkles
                        size={13}
                        className="text-cyan-300"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                        PEERLY LEARNING CORE
                      </span>

                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                    </div>

                    <p className="text-sm font-medium text-white/45">
                      Welcome back,
                    </p>

                    <h2 className="mt-1 max-w-3xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                      {student?.name ||
                        user?.name ||
                        "Student"}
                      <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                        .
                      </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                      Ask questions, connect with
                      senior students, and turn
                      every academic doubt into
                      an opportunity to learn.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          navigate("/doubt-form")
                        }
                        className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-violet-900/50"
                      >
                        <MessageCircleQuestion
                          size={17}
                        />

                        Ask a Doubt

                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>

                      <button
                        onClick={() =>
                          setActiveSection("tutors")
                        }
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white/70 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/[0.06] hover:text-white"
                      >
                        <Users size={16} />
                        Explore Tutors
                      </button>
                    </div>
                  </div>

                  {/* KNOWLEDGE CORE */}

                  <div className="hidden justify-center lg:flex">
                    <div className="relative flex h-60 w-60 items-center justify-center">
                      <div className="absolute inset-4 rounded-full border border-violet-400/20" />

                      <div className="absolute inset-8 rounded-full border border-cyan-400/20" />

                      <div className="absolute inset-12 rounded-full border border-white/10 bg-gradient-to-br from-violet-500/20 via-indigo-500/10 to-cyan-400/10 shadow-[0_0_80px_rgba(139,92,246,0.2)] backdrop-blur-xl" />

                      <div className="absolute inset-[68px] rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-400/20 blur-xl" />

                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[#0a0912]/90 shadow-[0_0_45px_rgba(139,92,246,0.3)]">
                        <BrainCircuit
                          size={38}
                          className="text-cyan-300"
                        />
                      </div>

                      <div className="absolute left-3 top-20 flex items-center gap-2 rounded-lg border border-white/10 bg-[#090911]/80 px-2.5 py-2 backdrop-blur-xl">
                        <CircleDot
                          size={11}
                          className="text-cyan-400"
                        />

                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/45">
                          AI READY
                        </span>
                      </div>

                      <div className="absolute bottom-8 right-0 flex items-center gap-2 rounded-lg border border-white/10 bg-[#090911]/80 px-2.5 py-2 backdrop-blur-xl">
                        <Zap
                          size={11}
                          className="text-violet-300"
                        />

                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/45">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  STATS
              ================================================== */}

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FuturisticStat
                  label="MY DOUBTS"
                  value={doubts.length}
                  description="Questions submitted"
                  icon={MessageCircleQuestion}
                  iconClass="text-violet-300"
                />

                <FuturisticStat
                  label="PEER TUTORS"
                  value={tutors.length}
                  description="Tutors available"
                  icon={Users}
                  iconClass="text-cyan-300"
                />

                <FuturisticStat
                  label="SESSIONS"
                  value={bookings.length}
                  description="Booked sessions"
                  icon={CalendarDays}
                  iconClass="text-indigo-300"
                />

                <FuturisticStat
                  label="CREDITS"
                  value={student?.credits ?? 0}
                  description="Learning balance"
                  icon={Coins}
                  iconClass="text-amber-300"
                />
              </section>

              {/* =================================================
                  QUICK ACTIONS
              ================================================== */}

              <section className="grid gap-4 md:grid-cols-3">
                <QuickAction
                  icon={BrainCircuit}
                  label="AI DOUBT ANALYSIS"
                  title="Submit a question"
                  description="Let AI identify the subject, topic and difficulty."
                  onClick={() =>
                    navigate("/doubt-form")
                  }
                  accent="violet"
                />

                <QuickAction
                  icon={GraduationCap}
                  label="PEER NETWORK"
                  title="Find a tutor"
                  description="Connect with students who specialize in your subject."
                  onClick={() =>
                    setActiveSection("tutors")
                  }
                  accent="cyan"
                />

                <QuickAction
                  icon={CalendarDays}
                  label="LEARNING SCHEDULE"
                  title="View bookings"
                  description="Manage your upcoming peer learning sessions."
                  onClick={() =>
                    setActiveSection("bookings")
                  }
                  accent="indigo"
                />
              </section>

              {/* =================================================
                  RECOMMENDED TUTORS
              ================================================== */}

              <section>
                <SectionHeader
                  eyebrow="PEER NETWORK"
                  title="Recommended Tutors"
                  description="Connect with experienced students who can help you move forward."
                  action="View all"
                  onAction={() =>
                    setActiveSection("tutors")
                  }
                />

                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {tutors.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No tutors available"
                      description="Peer tutors will appear here when they become available."
                    />
                  ) : (
                    tutors
                      .slice(0, 3)
                      .map((tutor) => (
                        <div
                          key={
                            tutor.id ||
                            tutor._id
                          }
                          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.04]"
                        >
                          <TutorCard
                            tutor={tutor}
                            onBook={
                              handleBookTutor
                            }
                          />
                        </div>
                      ))
                  )}
                </div>
              </section>

              {/* =================================================
                  DOUBTS + BOOKING PREVIEW
              ================================================== */}

              <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
                <div className="min-w-0 overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl">
                  <div className="border-b border-white/[0.06] p-5 sm:p-6">
                    <SectionHeader
                      eyebrow="AI ANALYSIS"
                      title="My Doubts"
                      description="Your questions and their current AI processing status."
                      action="View all"
                      onAction={() =>
                        setActiveSection("overview")
                      }
                    />
                  </div>

                  <div className="p-2 sm:p-4">
                    <DoubtTable
                      doubts={doubts}
                    />
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl">
                  <div className="border-b border-white/[0.06] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock3
                            size={14}
                            className="text-cyan-300"
                          />

                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/70">
                            LIVE SCHEDULE
                          </span>
                        </div>

                        <h3 className="mt-2 text-lg font-bold">
                          Upcoming Sessions
                        </h3>
                      </div>

                      <button
                        onClick={() =>
                          setActiveSection(
                            "bookings"
                          )
                        }
                        className="text-xs font-semibold text-white/40 transition hover:text-cyan-300"
                      >
                        All
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    {upcomingBookings.length ===
                    0 ? (
                      <EmptyState
                        icon={CalendarDays}
                        title="No sessions yet"
                        description="Your booked peer sessions will appear here."
                        compact
                      />
                    ) : (
                      upcomingBookings.map(
                        (booking) => (
                          <BookingCard
                            key={
                              booking.id ||
                              booking._id
                            }
                            booking={
                              booking
                            }
                          />
                        )
                      )
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* =====================================================
              TUTORS
          ====================================================== */}

          {activeSection === "tutors" && (
            <section>
              <PageHeader
                eyebrow="PEER NETWORK"
                title="Find a Peer Tutor"
                description="Choose a tutor based on subject specialization, experience and availability."
                icon={Users}
              />

              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {tutors.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No tutors available"
                    description="There are currently no peer tutors available."
                  />
                ) : (
                  tutors.map((tutor) => (
                    <div
                      key={
                        tutor.id ||
                        tutor._id
                      }
                      className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/20"
                    >
                      <TutorCard
                        tutor={tutor}
                        onBook={
                          handleBookTutor
                        }
                      />
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              BOOKINGS
          ====================================================== */}

          {activeSection === "bookings" && (
            <section>
              <PageHeader
                eyebrow="LEARNING SCHEDULE"
                title="My Bookings"
                description="Manage your upcoming peer tutoring sessions."
                icon={CalendarDays}
              />

              <div className="mt-7 space-y-4">
                {bookings.length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="No bookings yet"
                    description="Book a peer tutor to create your first learning session."
                  />
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={
                        booking.id ||
                        booking._id
                      }
                      className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl"
                    >
                      <BookingCard
                        booking={booking}
                      />
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              REWARDS
          ====================================================== */}

          {activeSection === "rewards" && (
            <section className="mx-auto max-w-3xl">
              <PageHeader
                eyebrow="PEERLY ECONOMY"
                title="Learning Credits"
                description="Your credits represent participation in the peer learning network."
                icon={Coins}
              />

              <div className="relative mt-7 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-8 text-center shadow-2xl shadow-violet-950/20 backdrop-blur-2xl sm:p-12">
                <div className="absolute left-1/2 top-[-150px] h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/10 blur-[100px]" />

                <div className="relative">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-amber-300/20 bg-amber-400/[0.06] shadow-[0_0_50px_rgba(251,191,36,0.08)]">
                    <Coins
                      size={40}
                      className="text-amber-300"
                    />
                  </div>

                  <div className="mt-7 text-5xl font-black tracking-tight sm:text-6xl">
                    {student?.credits ?? 0}
                  </div>

                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.25em] text-amber-300/70">
                    LEARNING CREDITS
                  </p>

                  <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/40">
                    Earn credits through peer
                    learning, helping other
                    students and participating
                    in the Peerly community.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* =====================================================
              PROFILE
          ====================================================== */}

          {activeSection === "profile" && (
            <section className="mx-auto max-w-4xl">
              <PageHeader
                eyebrow="STUDENT IDENTITY"
                title="My Profile"
                description="Your academic identity within the Peerly network."
                icon={GraduationCap}
              />

              <div className="relative mt-7 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-violet-950/20 backdrop-blur-2xl">
                <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />

                {/* PROFILE HEADER */}

                <div className="relative flex flex-col gap-5 border-b border-white/[0.06] p-6 sm:flex-row sm:items-center sm:p-8">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-2xl font-black text-white shadow-lg shadow-violet-950/20">
                    {initials}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/70">
                        ACTIVE STUDENT
                      </span>
                    </div>

                    <h2 className="text-2xl font-black">
                      {student?.name ||
                        user?.name ||
                        "Student"}
                    </h2>

                    <p className="mt-1 text-sm text-white/40">
                      {student?.role ||
                        user?.role ||
                        "student"}
                    </p>
                  </div>
                </div>

                {/* DETAILS */}

                <div className="relative grid gap-px bg-white/[0.04] sm:grid-cols-2">
                  <ProfileField
                    label="DEPARTMENT"
                    value={
                      student?.department ||
                      "Not provided"
                    }
                  />

                  <ProfileField
                    label="SEMESTER"
                    value={
                      student?.semester ||
                      "Not provided"
                    }
                  />

                  <ProfileField
                    label="DOUBTS SUBMITTED"
                    value={doubts.length}
                  />

                  <ProfileField
                    label="CREDIT BALANCE"
                    value={
                      student?.credits ?? 0
                    }
                  />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   FUTURISTIC STAT
============================================================ */

function FuturisticStat({
  label,
  value,
  description,
  icon: Icon,
  iconClass = "text-cyan-300",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]">
      <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-violet-500/10 blur-2xl transition group-hover:bg-violet-500/20" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/35">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-white/35">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <Icon
            size={18}
            className={iconClass}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon: Icon,
  label,
  title,
  description,
  onClick,
  accent = "violet",
}) {
  const accentClasses = {
    violet: "text-violet-300 bg-violet-500/10",
    cyan: "text-cyan-300 bg-cyan-500/10",
    indigo: "text-indigo-300 bg-indigo-500/10",
  };

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses[accent]}`}
        >
          <Icon size={18} />
        </div>

        <ArrowRight
          size={16}
          className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white/60"
        />
      </div>

      <p className="mt-5 text-[9px] font-bold tracking-[0.2em] text-white/30">
        {label}
      </p>

      <h3 className="mt-1 text-base font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {description}
      </p>
    </button>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold tracking-[0.22em] text-cyan-400/65">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-white/35 sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {action && (
        <button
          onClick={onAction}
          className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-white/40 transition hover:text-cyan-300 sm:flex"
        >
          {action}

          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

/* ============================================================
   PAGE HEADER
============================================================ */

function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8">
      <div className="absolute right-[-70px] top-[-90px] h-56 w-56 rounded-full bg-violet-600/10 blur-[80px]" />

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
          <Icon size={21} />
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-cyan-400/70">
            {eyebrow}
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  icon: Icon,
  title,
  description,
  compact = false,
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-white/10 bg-white/[0.015] text-center ${
        compact
          ? "p-7"
          : "p-10 md:col-span-2 xl:col-span-3"
      }`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
        <Icon
          size={21}
          className="text-white/20"
        />
      </div>

      <p className="mt-4 text-sm font-semibold text-white/65">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-white/30">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   PROFILE FIELD
============================================================ */

function ProfileField({ label, value }) {
  return (
    <div className="bg-[#080810]/80 p-5 sm:p-6">
      <p className="text-[9px] font-bold tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white/70">
        {value}
      </p>
    </div>
  );
}