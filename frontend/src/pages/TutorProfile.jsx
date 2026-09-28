import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  CheckCircle2,
  GraduationCap,
  Info,
  Save,
  Sparkles,
  Tags,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TutorProfile.css";

import {
  getMyTutorProfile,
  updateTutorProfile,
} from "../services/api";

const SUBJECTS = [
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
  "Object-Oriented Programming",
  "Computer Organization",
  "Theory of Computation",
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Software Engineering",
  "Discrete Mathematics",
];

export default function TutorProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bio: "",
    subjects: [],
    topics: [],
    skills: [],
  });

  const [topicsInput, setTopicsInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==================================================
  // LOAD PROFILE
  // ==================================================

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMyTutorProfile();

      const profile =
        response?.data || null;

      const subjects =
        Array.isArray(profile?.subjects)
          ? profile.subjects
          : [];

      const topics =
        Array.isArray(profile?.topics)
          ? profile.topics
          : [];

      const skills =
        Array.isArray(profile?.skills)
          ? profile.skills
          : [];

      setForm({
        bio: profile?.bio || "",
        subjects,
        topics,
        skills,
      });

      setTopicsInput(
        topics.join(", ")
      );

      setSkillsInput(
        skills.join(", ")
      );
    } catch (err) {
      console.error(
        "Tutor profile loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load tutor profile."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // SUBJECT SELECTION
  // ==================================================

  function toggleSubject(subject) {
    setForm((prev) => {
      const exists =
        prev.subjects.includes(subject);

      return {
        ...prev,
        subjects: exists
          ? prev.subjects.filter(
              (item) => item !== subject
            )
          : [
              ...prev.subjects,
              subject,
            ],
      };
    });
  }

  // ==================================================
  // ARRAY CONVERSION
  // ==================================================

  function convertToArray(value) {
    return [
      ...new Set(
        value
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean)
      ),
    ];
  }

  // ==================================================
  // PROFILE COMPLETION
  // ==================================================

  const profileCompletion =
    useMemo(() => {
      let score = 0;

      if (form.bio.trim()) {
        score += 25;
      }

      if (form.subjects.length > 0) {
        score += 35;
      }

      if (form.topics.length > 0) {
        score += 20;
      }

      if (form.skills.length > 0) {
        score += 20;
      }

      return score;
    }, [form]);

  // ==================================================
  // SUBMIT
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (form.subjects.length === 0) {
      setError(
        "Please select at least one mastered subject."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setSaving(true);

      const topics =
        convertToArray(
          topicsInput
        );

      const skills =
        convertToArray(
          skillsInput
        );

      const response =
        await updateTutorProfile({
          bio: form.bio.trim(),
          subjects: form.subjects,
          topics,
          skills,
        });

      setForm((prev) => ({
        ...prev,
        topics,
        skills,
      }));

      setTopicsInput(
        topics.join(", ")
      );

      setSkillsInput(
        skills.join(", ")
      );

      setMessage(
        response?.message ||
          "Profile updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Tutor profile update error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="tp-page">
        <div className="tp-grid" />

        <div className="tp-glow tp-glow-one" />
        <div className="tp-glow tp-glow-two" />

        <div className="tp-loading">
          <div className="tp-loading-icon">
            <BrainCircuit
              size={26}
            />
          </div>

          <p>
            INITIALIZING KNOWLEDGE CORE
          </p>

          <span>
            Loading tutor profile...
          </span>
        </div>
      </div>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="tp-page">

      {/* BACKGROUND */}

      <div className="tp-grid" />

      <div className="tp-scanline" />

      <div className="tp-glow tp-glow-one" />
      <div className="tp-glow tp-glow-two" />
      <div className="tp-glow tp-glow-three" />

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="tp-navbar">

        <button
          type="button"
          className="tp-back"
          onClick={() =>
            navigate("/tutor-dashboard")
          }
        >
          <ArrowLeft size={16} />

          <span>
            Back to Dashboard
          </span>
        </button>

        <div className="tp-brand">

          <div className="tp-brand-icon">
            <BrainCircuit
              size={17}
            />
          </div>

          <div>
            <strong>
              PEERLY
            </strong>

            <span>
              KNOWLEDGE EXCHANGE
            </span>
          </div>

        </div>

        <div className="tp-status">

          <span className="tp-status-dot" />

          PROFILE MODE

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="tp-main">

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="tp-hero">

          <div className="tp-hero-glow" />

          <div className="tp-hero-content">

            <div className="tp-avatar">

              <UserRound
                size={30}
              />

              <div className="tp-avatar-orbit" />

            </div>

            <div className="tp-hero-text">

              <div className="tp-eyebrow">

                <Sparkles
                  size={12}
                />

                TUTOR NETWORK

              </div>

              <h1>
                Your{" "}
                <span>
                  Knowledge Core
                </span>
              </h1>

              <p>
                Configure your expertise,
                teaching skills and subject
                specializations so Peerly's
                AI can route relevant student
                doubts to you.
              </p>

            </div>

          </div>

          {/* COMPLETION */}

          <div className="tp-completion">

            <div className="tp-completion-top">

              <div>
                <span>
                  PROFILE SIGNAL
                </span>

                <strong>
                  {profileCompletion}%
                </strong>
              </div>

              <BrainCircuit
                size={18}
              />

            </div>

            <div className="tp-progress">

              <div
                style={{
                  width: `${profileCompletion}%`,
                }}
              />

            </div>

            <p>
              {profileCompletion ===
              100
                ? "Your knowledge profile is fully configured."
                : "Complete your profile to improve tutor matching."}
            </p>

          </div>

        </section>

        {/* ==================================================
            MESSAGES
        ================================================== */}

        {error && (
          <div className="tp-alert tp-alert-error">

            <div className="tp-alert-icon">
              <X size={16} />
            </div>

            <div>
              <strong>
                PROFILE UPDATE ERROR
              </strong>

              <span>
                {error}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X size={15} />
            </button>

          </div>
        )}

        {message && (
          <div className="tp-alert tp-alert-success">

            <div className="tp-alert-icon">
              <CheckCircle2
                size={16}
              />
            </div>

            <div>
              <strong>
                KNOWLEDGE CORE UPDATED
              </strong>

              <span>
                {message}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setMessage("")
              }
            >
              <X size={15} />
            </button>

          </div>
        )}

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="tp-layout"
        >

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <div className="tp-left">

            {/* BIO */}

            <section className="tp-card">

              <div className="tp-card-header">

                <div className="tp-section-number">
                  01
                </div>

                <div>
                  <h2>
                    About You
                  </h2>

                  <p>
                    Give students a quick
                    understanding of who you are.
                  </p>
                </div>

              </div>

              <div className="tp-field">

                <label>
                  Tutor Bio
                </label>

                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        bio: e.target.value,
                      })
                    )
                  }
                  placeholder="Tell students about your experience, interests, academic background and teaching style..."
                  rows={7}
                  maxLength={800}
                />

                <div className="tp-field-footer">

                  <span>
                    {form.bio.length}/800
                  </span>

                  <span>
                    Keep it clear and student-friendly.
                  </span>

                </div>

              </div>

            </section>

            {/* SUBJECTS */}

            <section className="tp-card">

              <div className="tp-card-header">

                <div className="tp-section-number">
                  02
                </div>

                <div>
                  <h2>
                    Subject Specialization
                  </h2>

                  <p>
                    Select the subjects you can
                    confidently teach.
                  </p>
                </div>

              </div>

              <div className="tp-ai-info">

                <BrainCircuit
                  size={17}
                />

                <div>
                  <strong>
                    AI MATCHING SIGNAL
                  </strong>

                  <span>
                    Your selected subjects are
                    used as the primary signal
                    when matching student doubts.
                  </span>
                </div>

              </div>

              <div className="tp-subject-grid">

                {SUBJECTS.map(
                  (subject) => {

                    const selected =
                      form.subjects.includes(
                        subject
                      );

                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() =>
                          toggleSubject(
                            subject
                          )
                        }
                        className={`tp-subject ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                      >

                        <span className="tp-subject-check">

                          {selected && (
                            <Check
                              size={13}
                            />
                          )}

                        </span>

                        <span>
                          {subject}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

              <div className="tp-selection-footer">

                <div className="tp-selected-indicator">
                  <CheckCircle2
                    size={15}
                  />

                  <span>
                    {form.subjects.length}{" "}
                    subject
                    {form.subjects.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    selected
                  </span>
                </div>

                {form.subjects.length ===
                  0 && (
                  <span className="tp-warning">
                    Select at least one
                  </span>
                )}

              </div>

            </section>

          </div>

          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <aside className="tp-right">

            {/* TOPICS */}

            <section className="tp-card">

              <div className="tp-card-header compact">

                <div className="tp-icon-box cyan">
                  <Tags
                    size={16}
                  />
                </div>

                <div>
                  <h2>
                    Topic Expertise
                  </h2>

                  <p>
                    Specific concepts you can explain.
                  </p>
                </div>

              </div>

              <div className="tp-field">

                <label>
                  Topics
                </label>

                <input
                  value={topicsInput}
                  onChange={(e) =>
                    setTopicsInput(
                      e.target.value
                    )
                  }
                  placeholder="Trees, Graphs, SQL, Recursion..."
                />

                <span className="tp-helper">
                  Separate multiple topics
                  with commas.
                </span>

              </div>

            </section>

            {/* SKILLS */}

            <section className="tp-card">

              <div className="tp-card-header compact">

                <div className="tp-icon-box violet">
                  <Zap
                    size={16}
                  />
                </div>

                <div>
                  <h2>
                    Teaching Skills
                  </h2>

                  <p>
                    Strengths that define your teaching.
                  </p>
                </div>

              </div>

              <div className="tp-field">

                <label>
                  Skills
                </label>

                <input
                  value={skillsInput}
                  onChange={(e) =>
                    setSkillsInput(
                      e.target.value
                    )
                  }
                  placeholder="Problem Solving, Debugging..."
                />

                <span className="tp-helper">
                  Separate multiple skills
                  with commas.
                </span>

              </div>

            </section>

            {/* MATCHING PREVIEW */}

            <section className="tp-matching-card">

              <div className="tp-matching-orb">
                <BrainCircuit
                  size={22}
                />
              </div>

              <div>

                <span className="tp-matching-label">
                  AI ROUTING
                </span>

                <h3>
                  Your expertise
                  becomes a signal.
                </h3>

                <p>
                  Peerly analyzes student
                  doubts and compares their
                  subject, topic and tags
                  against your profile.
                </p>

              </div>

              <div className="tp-flow">

                <span>
                  DOUBT
                </span>

                <i />

                <span>
                  AI
                </span>

                <i />

                <span>
                  YOU
                </span>

              </div>

            </section>

            {/* SAVE PANEL */}

            <div className="tp-save-panel">

              <div className="tp-save-info">

                <div className="tp-save-icon">
                  <Save size={17} />
                </div>

                <div>
                  <strong>
                    Save changes
                  </strong>

                  <span>
                    Update your tutor profile
                  </span>
                </div>

              </div>

              <button
                type="submit"
                disabled={
                  saving ||
                  form.subjects.length ===
                    0
                }
                className="tp-save-button"
              >

                {saving ? (
                  <>
                    <span className="tp-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Profile
                  </>
                )}

              </button>

              <button
                type="button"
                className="tp-cancel-button"
                onClick={() =>
                  navigate(
                    "/tutor-dashboard"
                  )
                }
              >
                Cancel
              </button>

            </div>

          </aside>

        </form>

        {/* ==================================================
            FOOTER INFO
        ================================================== */}

        <div className="tp-footer-note">

          <Info size={13} />

          <span>
            Your specialization determines which
            academic doubts are routed to your tutor
            profile.
          </span>

        </div>

      </main>
    </div>
  );
}