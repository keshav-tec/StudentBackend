import { useMemo, useState } from "react";
import { tutors } from "../data/peerlyMockData";
import TutorCard from "./TutorCard";

export default function Hero() {
  const [query, setQuery] = useState("");

  const filteredTutors = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return tutors;

    return tutors.filter(
      (tutor) =>
        tutor.name.toLowerCase().includes(value) ||
        tutor.subject.toLowerCase().includes(value) ||
        tutor.specialty.toLowerCase().includes(value)
    );
  }, [query]);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#05050b] pt-28 text-white"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="absolute inset-0 futuristic-grid" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Center glow */}
        <div className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        {/* Left glow */}
        <div className="absolute -left-32 top-[35%] h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

        {/* Right glow */}
        <div className="absolute -right-32 top-[25%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* =========================================================
          SCAN LINE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 overflow-hidden opacity-30">
        <div className="scan-line h-32 bg-gradient-to-b from-transparent via-violet-400/10 to-transparent" />
      </div>

      {/* =========================================================
          MAIN CONTENT
          Full-width container — no max-w-7xl restriction
      ========================================================= */}

      <div className="relative w-full px-5 pb-20 sm:px-8 lg:px-12 xl:px-16">

        {/* =======================================================
            STATUS
        ======================================================= */}

        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
            Peer learning network / online
          </span>
        </div>

        {/* =======================================================
            HERO CONTENT
        ======================================================= */}

        <div className="mx-auto mt-10 w-full text-center">

          {/* Heading */}

          <h1 className="mx-auto w-full text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem]">
            Learn from
            <br />
            <span className="gradient-text">
              people who get it.
            </span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-7 w-full max-w-3xl text-sm leading-7 text-white/45 sm:text-base lg:text-lg">
            Peerly connects students with senior peers who can explain
            difficult concepts, clear academic doubts, and help you prepare
            with confidence.
          </p>

          {/* =====================================================
              SEARCH
          ===================================================== */}

          <div className="mx-auto mt-9 w-full max-w-4xl">
            <div className="glass-strong rounded-2xl p-2 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">

              <div className="flex flex-col gap-2 sm:flex-row">

                {/* Search Input */}

                <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/[0.04] px-4">

                  <svg
                    className="h-4 w-4 shrink-0 text-cyan-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>

                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search subjects, topics or tutors..."
                    className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25"
                  />
                </div>

                {/* Search Button */}

                <button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:shadow-violet-500/20"
                >
                  Find a Tutor
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              CTA BUTTONS
          ===================================================== */}

          <div className="mt-5 flex flex-wrap justify-center gap-3">

            <a
              href="/signup"
              className="rounded-xl bg-white px-6 py-3 text-xs font-black text-[#08080f] transition hover:-translate-y-1 hover:bg-cyan-50"
            >
              Start Learning
            </a>

            <a
              href="/signup"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-bold text-white/75 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              Become a Peer Tutor
            </a>

          </div>
        </div>

        {/* =======================================================
            FUTURISTIC LEARNING CORE
            Full available width
        ======================================================= */}

        <div className="relative mx-auto mt-20 h-[300px] w-full sm:h-[360px]">

          {/* Main glow */}

          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[100px]" />

          {/* =====================================================
              PEERLY ORB
          ===================================================== */}

          <div className="peerly-orb absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-violet-300/20 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.22),rgba(139,92,246,0.16)_35%,rgba(8,8,18,0.9)_72%)] shadow-[0_0_100px_rgba(139,92,246,0.22)] backdrop-blur-xl sm:h-64 sm:w-64">

              {/* Inner Orb */}

              <div className="peerly-orb-inner absolute h-36 w-36 rounded-full border border-cyan-300/20 bg-cyan-300/[0.04] shadow-[inset_0_0_50px_rgba(34,211,238,0.08)] sm:h-44 sm:w-44" />

              {/* Orb Text */}

              <div className="relative text-center">

                <div className="text-3xl font-black tracking-tight">
                  PEERLY
                </div>

                <div className="mt-2 text-[9px] uppercase tracking-[0.35em] text-cyan-300/60">
                  Knowledge exchange
                </div>

              </div>
            </div>
          </div>

          {/* =====================================================
              LEFT FLOATING CARD
          ===================================================== */}

          <div className="float-slow absolute left-[2%] top-8 hidden w-56 lg:block xl:left-[8%]">

            <div className="glass rounded-2xl p-4">

              <div className="flex items-center gap-3">

                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/20 text-lg">
                  ✦
                </div>

                <div>

                  <div className="text-[10px] uppercase tracking-wider text-white/30">
                    Live request
                  </div>

                  <div className="mt-1 text-xs font-bold text-white">
                    Data Structures
                  </div>

                </div>
              </div>

              {/* Progress */}

              <div className="mt-4 h-1 rounded-full bg-white/5">

                <div className="h-1 w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" />

              </div>

            </div>
          </div>

          {/* =====================================================
              RIGHT FLOATING CARD
          ===================================================== */}

          <div className="float-medium absolute right-[2%] top-12 hidden w-56 lg:block xl:right-[8%]">

            <div className="glass rounded-2xl p-4">

              <div className="flex items-center justify-between">

                <span className="text-[10px] uppercase tracking-wider text-white/30">
                  Matched tutor
                </span>

                <span className="text-cyan-300">
                  ●
                </span>

              </div>

              <div className="mt-4 flex items-center gap-3">

                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-black">
                  EW
                </div>

                <div>

                  <div className="text-xs font-bold">
                    Emily Watson
                  </div>

                  <div className="mt-1 text-[10px] text-white/35">
                    Biochemistry · 4.9 ★
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* =====================================================
              BOTTOM BADGE
          ===================================================== */}

          <div className="float-slow absolute bottom-4 left-1/2 hidden -translate-x-1/2 sm:block">

            <div className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-5 py-2 text-[10px] uppercase tracking-[0.22em] text-cyan-200/60 backdrop-blur-xl">
              50+ subjects connected
            </div>

          </div>

        </div>

        {/* =======================================================
            TUTOR AREA
        ======================================================= */}

        <div
          id="tutors"
          className="mt-8 w-full"
        >

          {/* Section Header */}

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-cyan-300/60">
                Explore the network
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                Top Subject Tutors
              </h2>

            </div>

            <span className="hidden text-xs font-semibold text-white/35 sm:block">
              Scroll →
            </span>

          </div>

          {/* =====================================================
              TUTOR CARDS
          ===================================================== */}

          {filteredTutors.length > 0 ? (

            <div className="flex gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

              {filteredTutors.map((tutor) => (
                <TutorCard
                  tutor={tutor}
                  key={tutor.id}
                />
              ))}

            </div>

          ) : (

            <div className="glass rounded-2xl p-8 text-center text-sm text-white/40">
              No tutors found for "{query}".
            </div>

          )}

        </div>

      </div>
    </section>
  );
}