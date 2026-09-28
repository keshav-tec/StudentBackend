/* =========================================================
   QUESTION TAGGER
   Gemini-powered College CSE Doubt Classification
========================================================= */

import { analyzeQuestionWithGemini } from "./geminiService.js";

/* =========================================================
   TAG QUESTION
========================================================= */

/*
 * Sends the student's question to Gemini and converts
 * the Gemini response into the exact structure expected
 * by the Doubt model and doubtRoutes.js.
 *
 * Returns:
 * - Academic validity
 * - Subject
 * - Topic
 * - Sub-topic
 * - Difficulty
 * - Tags
 * - Confidence
 * - Explanation
 *
 * IMPORTANT:
 * Gemini/API failures are NOT treated as invalid
 * academic questions.
 *
 * A question being invalid and the AI service failing
 * are two different situations.
 */

export async function tagQuestion(question) {

  /* -------------------------------------------------------
     Validate input
  ------------------------------------------------------- */

  if (
    typeof question !== "string" ||
    !question.trim()
  ) {
    return {
      isValidAcademicQuestion: false,

      category: "General",

      subTopic: "General",

      confidence: 0,

      explanation:
        "No valid question was provided for AI analysis.",

      subject: "General",

      topic: "General",

      difficulty: "medium",

      tags: ["invalid"],
    };
  }


  /* -------------------------------------------------------
     Send question to Gemini
  ------------------------------------------------------- */

  /*
   * IMPORTANT:
   *
   * There is intentionally NO try/catch here.
   *
   * If Gemini fails, the error is allowed to propagate
   * to doubtRoutes.js.
   *
   * This prevents an AI service failure from incorrectly
   * marking a genuine student question as "rejected".
   */

  const result =
    await analyzeQuestionWithGemini(
      question.trim()
    );


  /* -------------------------------------------------------
     Normalize Gemini response
  ------------------------------------------------------- */

  const subject =
    typeof result.subject === "string" &&
    result.subject.trim()
      ? result.subject.trim()
      : typeof result.category === "string" &&
        result.category.trim()
        ? result.category.trim()
        : "General";


  const topic =
    typeof result.topic === "string" &&
    result.topic.trim()
      ? result.topic.trim()
      : "General";


  const subTopic =
    typeof result.subTopic === "string" &&
    result.subTopic.trim()
      ? result.subTopic.trim()
      : "General";


  /* -------------------------------------------------------
     Normalize difficulty
  ------------------------------------------------------- */

  const normalizedDifficulty =
    String(
      result.difficulty || "medium"
    ).toLowerCase();

  const difficulty =
    ["easy", "medium", "hard"].includes(
      normalizedDifficulty
    )
      ? normalizedDifficulty
      : "medium";


  /* -------------------------------------------------------
     Normalize confidence
  ------------------------------------------------------- */

  let confidence =
    Number(result.confidence);

  if (Number.isNaN(confidence)) {
    confidence = 0;
  }

  confidence = Math.max(
    0,
    Math.min(1, confidence)
  );

  confidence = Number(
    confidence.toFixed(2)
  );


  /* -------------------------------------------------------
     Normalize tags
  ------------------------------------------------------- */

  let tags = [];

  if (Array.isArray(result.tags)) {

    tags = result.tags
      .filter(
        (tag) =>
          typeof tag === "string" &&
          tag.trim()
      )
      .map(
        (tag) =>
          tag.trim().toLowerCase()
      );

  }


  /* -------------------------------------------------------
     Add classification fields as searchable tags
  ------------------------------------------------------- */

  const generatedTags =
    new Set(tags);


  if (subject !== "General") {
    generatedTags.add(
      subject.toLowerCase()
    );
  }


  if (topic !== "General") {
    generatedTags.add(
      topic.toLowerCase()
    );
  }


  if (subTopic !== "General") {
    generatedTags.add(
      subTopic.toLowerCase()
    );
  }


  generatedTags.add(
    difficulty
  );


  tags = [...generatedTags];


  /* -------------------------------------------------------
     Academic validity
  ------------------------------------------------------- */

  const isValidAcademicQuestion =
    result.isValidAcademicQuestion === true;


  /* -------------------------------------------------------
     Explanation
  ------------------------------------------------------- */

  const explanation =
    typeof result.explanation === "string" &&
    result.explanation.trim()
      ? result.explanation.trim()
      : "The question was analyzed by the Peerly AI classification system.";


  /* -------------------------------------------------------
     Final Peerly analysis object
  ------------------------------------------------------- */

  const analysis = {

    isValidAcademicQuestion,

    category: subject,

    subTopic,

    confidence,

    explanation,

    subject,

    topic,

    difficulty,

    tags,

  };


  /* -------------------------------------------------------
     Debug logging
  ------------------------------------------------------- */

  console.log(
    "\n========================================"
  );

  console.log(
    "PEERLY AI QUESTION ANALYSIS"
  );

  console.log(
    "========================================"
  );

  console.log(
    "Question:",
    question.trim()
  );

  console.log(
    "Subject:",
    analysis.subject
  );

  console.log(
    "Topic:",
    analysis.topic
  );

  console.log(
    "Sub-topic:",
    analysis.subTopic
  );

  console.log(
    "Difficulty:",
    analysis.difficulty
  );

  console.log(
    "Confidence:",
    analysis.confidence
  );

  console.log(
    "Valid Academic Question:",
    analysis.isValidAcademicQuestion
  );

  console.log(
    "Tags:",
    analysis.tags
  );

  console.log(
    "Explanation:",
    analysis.explanation
  );

  console.log(
    "========================================\n"
  );


  return analysis;
}