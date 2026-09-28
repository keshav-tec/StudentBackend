import {
  MessageCircleQuestion,
  Mic,
  FileText,
  Brain,
  Tag,
  CircleCheck,
} from "lucide-react";

export default function DoubtTable({ doubts = [] }) {
  if (doubts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
          <MessageCircleQuestion
            size={26}
            className="text-white/25"
          />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-white/75">
          No doubts submitted yet
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-white/35">
          Ask your first doubt to get AI-powered classification and tutor
          recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {doubts.map((doubt) => {
        const analysis = doubt.aiAnalysis || {};

        const transcript =
          doubt.speechToText?.transcript ||
          doubt.question ||
          "No question text available.";

        const confidence =
          typeof analysis.confidence === "number"
            ? Math.round(analysis.confidence * 100)
            : 0;

        return (
          <div
            key={doubt._id || doubt.id}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090911]/80 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12]"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-600/[0.06] blur-[90px] transition-all duration-300 group-hover:bg-violet-600/[0.1]" />

            {/* =====================================================
                QUESTION HEADER
            ====================================================== */}

            <div className="relative border-b border-white/[0.06] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Input type */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      doubt.inputType === "voice"
                        ? "border-violet-400/20 bg-violet-500/10 text-violet-300"
                        : "border-cyan-400/20 bg-cyan-500/10 text-cyan-300"
                    }`}
                  >
                    {doubt.inputType === "voice" ? (
                      <Mic size={19} />
                    ) : (
                      <FileText size={19} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/85">
                      {doubt.inputType === "voice"
                        ? "Voice Doubt"
                        : "Text Doubt"}
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      {doubt.createdAt
                        ? new Date(
                            doubt.createdAt
                          ).toLocaleString()
                        : "Recently submitted"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    doubt.status === "validated"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : doubt.status === "rejected"
                      ? "border-red-400/20 bg-red-400/10 text-red-300"
                      : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {doubt.status || "pending"}
                </span>
              </div>

              {/* =====================================================
                  TRANSCRIPT / QUESTION
              ====================================================== */}

              <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.025] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,0.8)]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400/60">
                    {doubt.inputType === "voice"
                      ? "Speech-to-Text Transcript"
                      : "Question"}
                  </p>
                </div>

                <p className="text-sm leading-6 text-white/65">
                  {transcript}
                </p>
              </div>
            </div>

            {/* =====================================================
                AI ANALYSIS
            ====================================================== */}

            <div className="relative p-5 sm:p-6">
              {/* AI heading */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                  <Brain size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white/85">
                    AI Analysis
                  </h3>

                  <p className="mt-0.5 text-xs text-white/35">
                    Automatically categorized by Peerly AI
                  </p>
                </div>
              </div>

              {/* =====================================================
                  CLASSIFICATION
              ====================================================== */}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <AnalysisItem
                  label="Subject"
                  value={
                    doubt.subject ||
                    analysis.category ||
                    "General"
                  }
                  accent="violet"
                />

                <AnalysisItem
                  label="Topic"
                  value={doubt.topic || "General"}
                  accent="cyan"
                />

                <AnalysisItem
                  label="Sub-topic"
                  value={
                    analysis.subTopic ||
                    "General"
                  }
                  accent="indigo"
                />

                <AnalysisItem
                  label="Difficulty"
                  value={
                    doubt.difficulty
                      ? capitalize(
                          doubt.difficulty
                        )
                      : "Medium"
                  }
                  accent="amber"
                />
              </div>

              {/* =====================================================
                  CONFIDENCE
              ====================================================== */}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                    AI Confidence
                  </p>

                  <p className="text-xs font-bold text-violet-300">
                    {confidence}%
                  </p>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 via-violet-500 to-cyan-400 shadow-[0_0_10px_rgba(139,92,246,0.35)] transition-all duration-500"
                    style={{
                      width: `${confidence}%`,
                    }}
                  />
                </div>
              </div>

              {/* =====================================================
                  TAGS
              ====================================================== */}

              {doubt.tags?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Tag
                      size={14}
                      className="text-white/30"
                    />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                      Tags
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {doubt.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="rounded-full border border-violet-400/10 bg-violet-500/[0.07] px-3 py-1.5 text-[11px] font-medium text-violet-300 transition hover:border-violet-400/20 hover:bg-violet-500/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* =====================================================
                  EXPLANATION
              ====================================================== */}

              {analysis.explanation && (
                <div className="mt-6 rounded-xl border border-violet-400/10 bg-gradient-to-r from-violet-500/[0.07] to-cyan-500/[0.03] p-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/10">
                      <CircleCheck
                        size={16}
                        className="text-violet-300"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300/70">
                        AI Classification Explanation
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {analysis.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AnalysisItem({
  label,
  value,
  accent = "violet",
}) {
  const accentClasses = {
    violet: {
      border: "border-violet-400/10",
      dot: "bg-violet-400",
      label: "text-violet-300/60",
    },
    cyan: {
      border: "border-cyan-400/10",
      dot: "bg-cyan-400",
      label: "text-cyan-300/60",
    },
    indigo: {
      border: "border-indigo-400/10",
      dot: "bg-indigo-400",
      label: "text-indigo-300/60",
    },
    amber: {
      border: "border-amber-400/10",
      dot: "bg-amber-400",
      label: "text-amber-300/60",
    },
  };

  const colors = accentClasses[accent];

  return (
    <div
      className={`rounded-xl border ${colors.border} bg-white/[0.025] p-4 transition hover:bg-white/[0.04]`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${colors.dot}`}
        />

        <p
          className={`text-[9px] font-bold uppercase tracking-[0.18em] ${colors.label}`}
        >
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-semibold text-white/75">
        {value}
      </p>
    </div>
  );
}

function capitalize(value) {
  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}