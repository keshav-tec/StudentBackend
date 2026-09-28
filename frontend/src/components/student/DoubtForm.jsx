import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Send,
  Loader2,
  MessageCircleQuestion,
  ArrowLeft,
} from "lucide-react";

import {
  submitTextDoubt,
  submitVoiceDoubt,
} from "../../services/api";

export default function DoubtForm() {
  const navigate = useNavigate();

  /* =====================================================
     STATE
  ===================================================== */

  const [question, setQuestion] = useState("");
  const [inputMode, setInputMode] = useState("text");

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  /* =====================================================
     REFS
  ===================================================== */

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const audioChunksRef = useRef([]);

  const timerRef = useRef(null);

  const audioRef = useRef(null);

  /* =====================================================
     SUPPORTED MIME TYPE
  ===================================================== */

  const getSupportedMimeType = () => {
    const mimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    for (const type of mimeTypes) {
      if (
        typeof MediaRecorder !== "undefined" &&
        MediaRecorder.isTypeSupported(type)
      ) {
        return type;
      }
    }

    return "";
  };

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [audioUrl]);

  /* =====================================================
     RECORDING TIMER
  ===================================================== */

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((previous) => previous + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording, isPaused]);

  /* =====================================================
     FORMAT TIME
  ===================================================== */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const remainingSeconds = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  /* =====================================================
     START RECORDING
  ===================================================== */

  const startRecording = async () => {
    try {
      if (submitting) return;

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl("");
      setAudioBlob(null);
      setIsPlaying(false);
      setRecordingTime(0);

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Audio recording is not supported in this browser."
        );
        return;
      }

      if (typeof MediaRecorder === "undefined") {
        alert(
          "MediaRecorder is not supported in this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaStreamRef.current = stream;

      const mimeType = getSupportedMimeType();

      console.log(
        "Selected recording MIME type:",
        mimeType
      );

      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
          })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        console.log(
          "Audio chunk received:",
          event.data.size,
          event.data.type
        );

        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        console.log("Recorder stopped.");

        const chunks =
          audioChunksRef.current;

        console.log(
          "Total chunks:",
          chunks.length
        );

        if (!chunks.length) {
          console.error(
            "No audio chunks were recorded."
          );

          alert(
            "No audio was recorded. Please try again."
          );

          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          return;
        }

        const finalMimeType =
          recorder.mimeType ||
          chunks[0]?.type ||
          mimeType ||
          "audio/webm";

        const blob = new Blob(
          chunks,
          {
            type: finalMimeType,
          }
        );

        console.log(
          "================================"
        );

        console.log(
          "Created audio blob:"
        );

        console.log("Blob:", blob);

        console.log(
          "Is Blob:",
          blob instanceof Blob
        );

        console.log(
          "Blob size:",
          blob.size
        );

        console.log(
          "Blob type:",
          blob.type
        );

        console.log(
          "================================"
        );

        if (!(blob instanceof Blob)) {
          alert(
            "Failed to create the audio recording."
          );

          return;
        }

        if (blob.size === 0) {
          alert(
            "The recording is empty. Please record again."
          );

          return;
        }

        const url =
          URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        mediaStreamRef.current = null;
      };

      recorder.onerror = (event) => {
        console.error(
          "MediaRecorder error:",
          event
        );

        alert(
          "An error occurred while recording audio."
        );

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      };

      recorder.start(1000);

      setInputMode("voice");
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      console.log(
        "Recording started."
      );
    } catch (error) {
      console.error(
        "Microphone permission failed:",
        error
      );

      if (mediaStreamRef.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        mediaStreamRef.current = null;
      }

      alert(
        "Microphone access was denied. Please allow microphone permission and try again."
      );
    }
  };

  /* =====================================================
     STOP RECORDING
  ===================================================== */

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) return;

    console.log(
      "Stopping recording..."
    );

    if (
      recorder.state === "recording" ||
      recorder.state === "paused"
    ) {
      recorder.stop();
    }

    setIsRecording(false);
    setIsPaused(false);

    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );

      timerRef.current = null;
    }
  };

  /* =====================================================
     PAUSE / RESUME
  ===================================================== */

  const togglePause = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) return;

    if (
      recorder.state === "recording"
    ) {
      recorder.pause();
      setIsPaused(true);
    } else if (
      recorder.state === "paused"
    ) {
      recorder.resume();
      setIsPaused(false);
    }
  };

  /* =====================================================
     PLAY / PAUSE AUDIO
  ===================================================== */

  const togglePlayback = async () => {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(
          "Audio playback failed:",
          error
        );
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  /* =====================================================
     AUDIO ENDED
  ===================================================== */

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  /* =====================================================
     DELETE RECORDING
  ===================================================== */

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl("");
    setRecordingTime(0);
    setIsPlaying(false);
    setInputMode("text");

    audioChunksRef.current = [];
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRecording) {
      alert(
        "Please stop the recording before submitting."
      );
      return;
    }

    if (
      inputMode === "text" &&
      !question.trim()
    ) {
      alert(
        "Please enter your doubt."
      );
      return;
    }

    if (
      inputMode === "voice" &&
      !audioBlob
    ) {
      alert(
        "Please record your doubt first."
      );
      return;
    }

    try {
      setSubmitting(true);

      let response;

      if (inputMode === "text") {
        response =
          await submitTextDoubt(
            question.trim()
          );
      }

      if (inputMode === "voice") {
        if (
          !(audioBlob instanceof Blob)
        ) {
          console.error(
            "Invalid audioBlob:",
            audioBlob
          );

          throw new Error(
            "The recorded audio is invalid. Please record again."
          );
        }

        if (audioBlob.size === 0) {
          throw new Error(
            "The recorded audio is empty. Please record again."
          );
        }

        console.log(
          "Preparing voice upload:"
        );

        console.log(
          "Blob size:",
          audioBlob.size
        );

        console.log(
          "Blob type:",
          audioBlob.type
        );

        const formData =
          new FormData();

        const extension =
          audioBlob.type.includes("ogg")
            ? "ogg"
            : audioBlob.type.includes("mp4")
            ? "mp4"
            : "webm";

        const filename =
          `voice-doubt.${extension}`;

        formData.append(
          "audio",
          audioBlob,
          filename
        );

        console.log(
          "FormData contents:"
        );

        for (
          const [key, value] of formData.entries()
        ) {
          console.log(
            key,
            value,
            value instanceof Blob
              ? {
                  size: value.size,
                  type: value.type,
                }
              : ""
          );
        }

        response =
          await submitVoiceDoubt(
            formData
          );
      }

      if (!response) {
        throw new Error(
          "No response received from the server."
        );
      }

      console.log(
        "Doubt submission response:",
        response
      );

      const matches =
        response.matches || [];

      navigate(
        "/student-dashboard",
        {
          state: {
            doubtSubmitted: true,

            message:
              response.message ||
              "Doubt submitted successfully.",

            matches,
          },
        }
      );
    } catch (error) {
      console.error(
        "Doubt submission failed:",
        error
      );

      console.error(
        "Server response:",
        error?.response?.data
      );

      alert(
        error?.response?.data
          ?.message ||
          error?.message ||
          "Failed to submit the doubt."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#05050b] px-4 py-5 text-white sm:px-6 lg:px-8 lg:py-8">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/[0.07] blur-[120px]" />

        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-500/[0.04] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/student-dashboard"
            )
          }
          className="group mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-300"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition group-hover:border-violet-400/20 group-hover:bg-violet-500/10">
            <ArrowLeft size={16} />
          </span>

          Back to Dashboard
        </button>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090911]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7 lg:p-8"
        >
          {/* Form ambient glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/[0.08] blur-[100px]" />

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="relative mb-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.08)]">
                <MessageCircleQuestion
                  size={21}
                />
              </div>

              <div>
                <h2 className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-xl font-bold tracking-wide text-transparent">
                  Ask a Doubt
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Type your question or record it using
                  your microphone.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              INPUT MODE
          ================================================= */}

          <div className="relative mb-6 rounded-xl border border-white/[0.06] bg-white/[0.025] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() =>
                  setInputMode("text")
                }
                disabled={
                  submitting ||
                  isRecording
                }
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  inputMode === "text"
                    ? "border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.06)]"
                    : "border border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Type Doubt
              </button>

              <button
                type="button"
                onClick={() =>
                  setInputMode("voice")
                }
                disabled={
                  submitting ||
                  isRecording
                }
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  inputMode === "voice"
                    ? "border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.05)]"
                    : "border border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                Voice Doubt
              </button>
            </div>
          </div>

          {/* =================================================
              TEXT MODE
          ================================================= */}

          {inputMode === "text" && (
            <div className="relative">
              <label className="mb-2.5 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                What are you struggling with?
              </label>

              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                placeholder="Describe your academic doubt..."
                rows={7}
                disabled={submitting}
                className="w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-4 text-sm leading-6 text-white/80 outline-none transition placeholder:text-slate-600 focus:border-violet-400/30 focus:bg-white/[0.035] focus:ring-4 focus:ring-violet-500/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-slate-600">
                Be as specific as possible so Peerly can
                find the right tutor.
              </p>
            </div>
          )}

          {/* =================================================
              VOICE MODE
          ================================================= */}

          {inputMode === "voice" && (
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">

              {/* =================================================
                  START RECORDING
              ================================================= */}

              {!audioBlob &&
                !isRecording && (
                  <div className="text-center">
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-xl" />

                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-violet-300">
                        <Mic size={30} />
                      </div>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-white/85">
                      Record your doubt
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Tap the microphone button and explain
                      your question naturally. Your recording
                      will be processed by Peerly.
                    </p>

                    <button
                      type="button"
                      onClick={
                        startRecording
                      }
                      disabled={
                        submitting
                      }
                      className="mx-auto mt-6 flex items-center gap-2 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600/80 to-violet-500/80 px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(139,92,246,0.15)] transition hover:from-violet-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Mic size={18} />
                      Start Recording
                    </button>
                  </div>
                )}

              {/* =================================================
                  RECORDING
              ================================================= */}

              {isRecording && (
                <div className="text-center">
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-red-500/10" />

                    <div className="absolute inset-2 rounded-full border border-red-400/20" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.12)]">
                      <Mic size={29} />
                    </div>
                  </div>

                  <p className="mt-5 text-sm font-semibold text-red-300">
                    {isPaused
                      ? "Recording paused"
                      : "Recording..."}
                  </p>

                  <p className="mt-1 text-2xl font-bold tabular-nums tracking-wider text-white/85">
                    {formatTime(
                      recordingTime
                    )}
                  </p>

                  <div className="mt-6 flex justify-center gap-3">
                    {/* PAUSE / RESUME */}

                    <button
                      type="button"
                      onClick={
                        togglePause
                      }
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                    >
                      {isPaused ? (
                        <>
                          <Play
                            size={16}
                            className="mr-2 inline"
                          />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause
                            size={16}
                            className="mr-2 inline"
                          />
                          Pause
                        </>
                      )}
                    </button>

                    {/* STOP */}

                    <button
                      type="button"
                      onClick={
                        stopRecording
                      }
                      className="rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/15"
                    >
                      <Square
                        size={15}
                        className="mr-2 inline"
                        fill="currentColor"
                      />
                      Stop
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  RECORDED AUDIO
              ================================================= */}

              {audioBlob &&
                !isRecording && (
                  <div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                      {/* PLAY */}

                      <button
                        type="button"
                        onClick={
                          togglePlayback
                        }
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-violet-300 transition hover:bg-violet-500/15 hover:text-violet-200"
                      >
                        {isPlaying ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white/75">
                          Recorded doubt
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatTime(
                            recordingTime
                          )}
                        </p>

                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          onEnded={
                            handleAudioEnded
                          }
                          className="hidden"
                        />
                      </div>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={
                          deleteRecording
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-300"
                        title="Delete recording"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {/* RECORD AGAIN */}

                    <button
                      type="button"
                      onClick={
                        startRecording
                      }
                      disabled={
                        submitting
                      }
                      className="mt-4 text-sm font-semibold text-violet-400 transition hover:text-cyan-300 disabled:opacity-50"
                    >
                      Record again
                    </button>
                  </div>
                )}
            </div>
          )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={
              submitting ||
              isRecording ||
              (inputMode === "text" &&
                !question.trim()) ||
              (inputMode === "voice" &&
                !audioBlob)
            }
            className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600/90 to-violet-500/90 px-5 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(139,92,246,0.12)] transition-all hover:from-violet-500 hover:to-cyan-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/[0.05] disabled:text-slate-600 disabled:shadow-none"
          >
            {submitting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Processing doubt...
              </>
            ) : (
              <>
                <Send size={17} />
                Submit Doubt
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}