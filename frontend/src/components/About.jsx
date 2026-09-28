export default function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#05050b] py-24"
    >
      {/* =====================================================
          BACKGROUND GRID
      ===================================================== */}

      <div className="absolute inset-0 futuristic-grid opacity-40" />

      {/* =====================================================
          BACKGROUND GLOWS
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* =====================================================
          FULL-WIDTH CONTENT
      ===================================================== */}

      <div className="relative grid w-full items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 xl:px-16">

        {/* ===================================================
            LEFT — MISSION
        =================================================== */}

        <div className="w-full">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300/60">
            Our mission
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Learning was never
            <br />
            <span className="gradient-text">
              meant to be lonely.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
            Peerly creates a student-powered knowledge network where learners
            can connect with senior peers, ask questions without hesitation,
            and get practical help exactly when they need it.
          </p>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3">

            {[
              ["10K+", "Sessions"],
              ["500+", "Peer Tutors"],
              ["50+", "Subjects"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="glass rounded-2xl p-4 transition hover:-translate-y-1"
              >
                <div className="text-xl font-black text-white">
                  {value}
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-wider text-white/30">
                  {label}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ===================================================
            RIGHT — FUTURISTIC VISUAL
        =================================================== */}

        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">

          <div className="float-slow glass rounded-[36px] p-4 neon-violet">

            <div className="relative overflow-hidden rounded-[28px] bg-[#0b0b17] p-6">

              {/* Internal grid */}

              <div className="absolute inset-0 futuristic-grid-small opacity-40" />

              <div className="relative">

                {/* -------------------------------------------
                    HEADER
                ------------------------------------------- */}

                <div className="flex items-center justify-between">

                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                    LIVE LEARNING CORE
                  </span>

                  <span className="flex items-center gap-2 text-[9px] text-emerald-300">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                    ACTIVE

                  </span>

                </div>

                {/* -------------------------------------------
                    CORE ORB
                ------------------------------------------- */}

                <div className="relative mx-auto my-12 flex h-48 w-48 items-center justify-center">

                  {/* Outer ring */}

                  <div className="absolute inset-0 rounded-full border border-violet-400/20 shadow-[0_0_70px_rgba(139,92,246,0.18)]" />

                  {/* Inner ring */}

                  <div className="absolute inset-6 rounded-full border border-cyan-300/20" />

                  {/* Core */}

                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-300/20 shadow-[0_0_60px_rgba(139,92,246,0.35)]" />

                  {/* Core text */}

                  <div className="absolute text-center">

                    <div className="text-lg font-black">
                      PEERLY
                    </div>

                    <div className="mt-1 text-[7px] uppercase tracking-[0.3em] text-cyan-300/60">
                      Knowledge exchange
                    </div>

                  </div>

                </div>

                {/* -------------------------------------------
                    STAT CARDS
                ------------------------------------------- */}

                <div className="grid grid-cols-2 gap-3">

                  <div className="glass rounded-2xl p-4">

                    <div className="text-[9px] uppercase tracking-widest text-white/25">
                      Doubts cleared
                    </div>

                    <div className="mt-2 text-xl font-black">
                      94.8%
                    </div>

                  </div>

                  <div className="glass rounded-2xl p-4">

                    <div className="text-[9px] uppercase tracking-widest text-white/25">
                      Active tutors
                    </div>

                    <div className="mt-2 text-xl font-black">
                      500+
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* =================================================
              DECORATIVE ELEMENTS
          ================================================= */}

          <div className="absolute -bottom-5 -left-5 h-14 w-14 rounded-2xl border border-cyan-300/10 bg-cyan-300/10 backdrop-blur-xl" />

          <div className="absolute -right-4 top-10 h-12 w-12 rotate-12 rounded-xl bg-violet-500/30 blur-sm" />

        </div>

      </div>
    </section>
  );
}