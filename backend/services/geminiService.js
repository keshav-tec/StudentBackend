/* =========================================================
   GEMINI AI QUESTION ANALYSIS SERVICE
   Primary Model + Fallback Model
   3 Attempts Per Model
========================================================= */

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";


/* =========================================================
   CONFIGURATION
========================================================= */

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing from environment variables"
  );
}


const PRIMARY_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash";


const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ||
  "gemini-2.0-flash";


const MAX_RETRIES = Math.max(
  1,
  Number(
    process.env.GEMINI_MAX_RETRIES || 3
  )
);


const ai = new GoogleGenAI({
  apiKey,
});


/* =========================================================
   PROMPT
========================================================= */

function buildPrompt(question) {
  return `
You are the AI Question Classification System for a college peer tutoring
platform called Peerly.

Analyze the student's academic question accurately.

The platform is mainly designed for Computer Science and Engineering
students.

Possible subjects include:

- Programming Fundamentals
- Data Structures
- Algorithms
- Object Oriented Programming
- Database Management Systems
- Operating Systems
- Computer Networks
- Computer Organization and Architecture
- Theory of Computation
- Compiler Design
- Software Engineering
- Artificial Intelligence
- Machine Learning
- Deep Learning
- Computer Graphics
- Web Development
- Cyber Security
- Discrete Mathematics
- Probability and Statistics
- Engineering Mathematics
- Digital Logic
- Cloud Computing
- Distributed Systems
- General Computer Science

You may select another academically appropriate subject if necessary.

Determine:

1. Whether this is a valid academic question.
2. The most appropriate subject.
3. The main topic.
4. The specific sub-topic.
5. Difficulty: easy, medium, or hard.
6. Useful tags.
7. Confidence between 0 and 1.
8. A short explanation of the classification.

Rules:

- Understand the complete meaning of the question.
- Do not classify based only on one keyword.
- Prefer specific CSE subjects when appropriate.
- If the question is not academic, set isValidAcademicQuestion to false.
- Do not invent concepts unrelated to the question.
- Tags should be short and useful for tutor matching.
- Difficulty represents the conceptual/technical difficulty of answering
  the question.
- Confidence must be between 0 and 1.
- Return ONLY JSON matching the requested schema.

Student question:

${JSON.stringify(question.trim())}
`;
}


/* =========================================================
   GEMINI RESPONSE SCHEMA
========================================================= */

const responseSchema = {
  type: "object",

  properties: {
    isValidAcademicQuestion: {
      type: "boolean",
    },

    category: {
      type: "string",
    },

    subject: {
      type: "string",
    },

    topic: {
      type: "string",
    },

    subTopic: {
      type: "string",
    },

    difficulty: {
      type: "string",

      enum: [
        "easy",
        "medium",
        "hard",
      ],
    },

    tags: {
      type: "array",

      items: {
        type: "string",
      },
    },

    confidence: {
      type: "number",
    },

    explanation: {
      type: "string",
    },
  },

  required: [
    "isValidAcademicQuestion",
    "category",
    "subject",
    "topic",
    "subTopic",
    "difficulty",
    "tags",
    "confidence",
    "explanation",
  ],
};


/* =========================================================
   SINGLE MODEL ATTEMPT
========================================================= */

async function tryModel(
  model,
  question,
  attempt
) {
  console.log(
    `\n[Gemini] Model: ${model} | Attempt: ${attempt}/${MAX_RETRIES}`
  );

  try {
    const response =
      await ai.models.generateContent({
        model,

        contents: buildPrompt(
          question
        ),

        config: {
          responseMimeType:
            "application/json",

          responseSchema,
        },
      });


    const text = response.text;


    if (!text) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }


    let result;

    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error(
        `[Gemini] Invalid JSON from ${model} on attempt ${attempt}`
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }


    console.log(
      `[Gemini] ${model} succeeded on attempt ${attempt}`
    );


    return result;

  } catch (error) {

    console.error(
      `[Gemini] ${model} failed on attempt ${attempt}:`,
      error?.message || error
    );

    throw error;
  }
}


/* =========================================================
   RETRY ONE MODEL
========================================================= */

async function tryModelWithRetries(
  model,
  question
) {
  let lastError = null;


  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {

    try {

      const result =
        await tryModel(
          model,
          question,
          attempt
        );

      return {
        success: true,
        result,
        model,
        attempts: attempt,
      };

    } catch (error) {

      lastError = error;


      /*
       * Small delay between retries.
       *
       * 500ms after first failure
       * 1000ms after second failure
       */

      if (attempt < MAX_RETRIES) {

        const delay =
          500 * attempt;

        console.log(
          `[Gemini] Retrying ${model} in ${delay}ms...`
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              delay
            )
        );
      }
    }
  }


  return {
    success: false,
    result: null,
    model,
    attempts: MAX_RETRIES,
    error: lastError,
  };
}


/* =========================================================
   MAIN ANALYSIS FUNCTION
========================================================= */

export async function analyzeQuestionWithGemini(
  question
) {

  if (
    typeof question !== "string" ||
    !question.trim()
  ) {
    throw new Error(
      "Question is required"
    );
  }


  const cleanQuestion =
    question.trim();


  console.log(
    "\n========================================"
  );

  console.log(
    "PEERLY AI QUESTION CLASSIFICATION"
  );

  console.log(
    "========================================"
  );

  console.log(
    "Question:",
    cleanQuestion
  );

  console.log(
    "Primary model:",
    PRIMARY_MODEL
  );

  console.log(
    "Fallback model:",
    FALLBACK_MODEL
  );

  console.log(
    "Attempts per model:",
    MAX_RETRIES
  );

  console.log(
    "========================================\n"
  );


  /* =======================================================
     STEP 1
     PRIMARY MODEL
  ======================================================== */

  const primaryResult =
    await tryModelWithRetries(
      PRIMARY_MODEL,
      cleanQuestion
    );


  if (primaryResult.success) {

    return normalizeResult(
      primaryResult.result,
      primaryResult.model
    );
  }


  console.warn(
    `\n[Gemini] Primary model ${PRIMARY_MODEL} failed after ${MAX_RETRIES} attempts.`
  );

  console.warn(
    `[Gemini] Switching to fallback model ${FALLBACK_MODEL}...`
  );


  /* =======================================================
     STEP 2
     FALLBACK MODEL
  ======================================================== */

  const fallbackResult =
    await tryModelWithRetries(
      FALLBACK_MODEL,
      cleanQuestion
    );


  if (fallbackResult.success) {

    return normalizeResult(
      fallbackResult.result,
      fallbackResult.model
    );
  }


  /* =======================================================
     BOTH MODELS FAILED
  ======================================================== */

  console.error(
    "\n========================================"
  );

  console.error(
    "ALL GEMINI ATTEMPTS FAILED"
  );

  console.error(
    `Primary: ${PRIMARY_MODEL} (${MAX_RETRIES} attempts)`
  );

  console.error(
    `Fallback: ${FALLBACK_MODEL} (${MAX_RETRIES} attempts)`
  );

  console.error(
    "========================================\n"
  );


  const error = new Error(
    "AI classification failed after all model attempts."
  );


  error.primaryModel =
    PRIMARY_MODEL;

  error.fallbackModel =
    FALLBACK_MODEL;

  error.primaryAttempts =
    primaryResult.attempts;

  error.fallbackAttempts =
    fallbackResult.attempts;

  error.primaryError =
    primaryResult.error;

  error.fallbackError =
    fallbackResult.error;


  throw error;
}


/* =========================================================
   NORMALIZE GEMINI RESULT
========================================================= */

function normalizeResult(
  result,
  model
) {

  result =
    result || {};


  /* -------------------------------------------------------
     Subject
  ------------------------------------------------------- */

  result.subject =
    typeof result.subject === "string" &&
    result.subject.trim()
      ? result.subject.trim()
      : typeof result.category === "string" &&
        result.category.trim()
        ? result.category.trim()
        : "General";


  /* -------------------------------------------------------
     Category
  ------------------------------------------------------- */

  result.category =
    typeof result.category === "string" &&
    result.category.trim()
      ? result.category.trim()
      : result.subject;


  /* -------------------------------------------------------
     Topic
  ------------------------------------------------------- */

  result.topic =
    typeof result.topic === "string" &&
    result.topic.trim()
      ? result.topic.trim()
      : "General";


  /* -------------------------------------------------------
     Sub-topic
  ------------------------------------------------------- */

  result.subTopic =
    typeof result.subTopic === "string" &&
    result.subTopic.trim()
      ? result.subTopic.trim()
      : "General";


  /* -------------------------------------------------------
     Difficulty
  ------------------------------------------------------- */

  const difficulty =
    String(
      result.difficulty ||
        "medium"
    ).toLowerCase();


  result.difficulty =
    [
      "easy",
      "medium",
      "hard",
    ].includes(difficulty)
      ? difficulty
      : "medium";


  /* -------------------------------------------------------
     Confidence
  ------------------------------------------------------- */

  let confidence =
    Number(result.confidence);


  if (
    Number.isNaN(confidence)
  ) {
    confidence = 0;
  }


  result.confidence =
    Math.max(
      0,
      Math.min(
        1,
        confidence
      )
    );


  result.confidence =
    Number(
      result.confidence.toFixed(2)
    );


  /* -------------------------------------------------------
     Tags
  ------------------------------------------------------- */

  if (
    !Array.isArray(
      result.tags
    )
  ) {
    result.tags = [];
  }


  result.tags =
    result.tags
      .filter(
        (tag) =>
          typeof tag === "string" &&
          tag.trim()
      )
      .map(
        (tag) =>
          tag.trim().toLowerCase()
      );


  /* -------------------------------------------------------
     Explanation
  ------------------------------------------------------- */

  result.explanation =
    typeof result.explanation ===
      "string" &&
    result.explanation.trim()
      ? result.explanation.trim()
      : "The question was analyzed by Peerly AI.";


  /* -------------------------------------------------------
     Metadata
  ------------------------------------------------------- */

  result.aiModel =
    model;


  result.aiProcessedAt =
    new Date();


  return result;
}