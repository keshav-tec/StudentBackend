const steps = [
  {
    number: "01",
    title: "Post Academic Doubt",
    text: "Tell us what concept, question, or topic you're struggling with.",
    icon: "01",
  },
  {
    number: "02",
    title: "Match Subject Tutor",
    text: "Find a senior peer whose expertise matches your academic need.",
    icon: "02",
  },
  {
    number: "03",
    title: "Attend Video/Lab Session",
    text: "Book a session and learn through guided tutoring and practical discussion.",
    icon: "03",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden bg-[#070710] py-24"
    >
      {/* =====================================================
          BACKGROUND GRID
      ===================================================== */}

      <div className="absolute inset-0 futuristic-grid-small opacity-60" />

      {/* =====================================================
          FULL-WIDTH CONTENT
      ===================================================== */}

      <div className="relative w-full px-5 sm:px-8 lg:px-12 xl:px-16">

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="mx-auto w-full max-w-3xl text-center">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300/60">
            The process
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">
              Three steps.
            </span>
            <br />
            Zero confusion.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
            From asking your question to actually understanding the answer.
          </p>

        </div>

        {/* ===================================================
            STEPS
        =================================================== */}

        <div className="mt-14 grid w-full gap-5 lg:grid-cols-3">

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative w-full"
            >

              {/* =================================================
                  CONNECTING LINE
              ================================================= */}

              {index !== 2 && (
                <div className="absolute left-full top-1/2 z-10 hidden h-px w-5 bg-gradient-to-r from-violet-400/40 to-cyan-300/20 lg:block" />
              )}

              {/* =================================================
                  STEP CARD
              ================================================= */}

              <article className="group glass h-full w-full rounded-[28px] p-7 transition duration-500 hover:-translate-y-2 hover:border-violet-400/25 hover:bg-white/[0.06]">

                {/* ---------------------------------------------
                    CARD TOP
                --------------------------------------------- */}

                <div className="flex items-center justify-between">

                  <span className="text-5xl font-black text-white/[0.06]">
                    {step.number}
                  </span>

                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-violet-300/10 bg-violet-500/10 text-xs font-black text-violet-300">
                    {step.icon}
                  </div>

                </div>

                {/* ---------------------------------------------
                    TITLE
                --------------------------------------------- */}

                <h3 className="mt-8 text-xl font-bold text-white">
                  {step.title}
                </h3>

                {/* ---------------------------------------------
                    DESCRIPTION
                --------------------------------------------- */}

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
                  {step.text}
                </p>

                {/* ---------------------------------------------
                    DIVIDER
                --------------------------------------------- */}

                <div className="mt-6 h-px w-full bg-white/5" />

                {/* ---------------------------------------------
                    STATUS
                --------------------------------------------- */}

                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-300/50">

                  Peerly network

                  <span className="h-1 w-1 rounded-full bg-cyan-300/70" />

                  Ready

                </div>

              </article>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}