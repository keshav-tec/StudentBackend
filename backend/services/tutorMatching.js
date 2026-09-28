import TutorProfile from "../models/TutorProfile.js";

/**
 * Normalize text for matching.
 */
function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/**
 * Check whether two strings reasonably match.
 *
 * Supports:
 * - exact matching
 * - partial matching
 *
 * Example:
 * "database management systems"
 * "Database Management Systems"
 */
function textMatches(a, b) {
  const first = normalize(a);
  const second = normalize(b);

  if (!first || !second) {
    return false;
  }

  return (
    first === second ||
    first.includes(second) ||
    second.includes(first)
  );
}


/**
 * Find tutors suitable for a doubt.
 *
 * Matching priority:
 *
 * 1. Subject      → mandatory
 * 2. Topic        → strong bonus
 * 3. Tags         → additional bonus
 * 4. Rating       → small bonus
 * 5. Experience   → small bonus
 *
 * A tutor without the required subject
 * will NOT be returned.
 */
export async function findTutorMatches({
  subject,
  topic,
  tags = [],
  limit = 10,
}) {

  const normalizedSubject =
    normalize(subject);

  const normalizedTopic =
    normalize(topic);

  const normalizedTags =
    Array.isArray(tags)
      ? [...new Set(
          tags
            .map(normalize)
            .filter(Boolean)
        )]
      : [];


  // ==================================================
  // VALIDATION
  // ==================================================

  if (!normalizedSubject) {
    return [];
  }


  // ==================================================
  // GET TUTOR PROFILES
  // ==================================================

  const tutors = await TutorProfile
    .find({})
    .populate(
      "userId",
      "name email profileImage college department year"
    )
    .lean();


  // ==================================================
  // SCORE TUTORS
  // ==================================================

  const scored = tutors
    .map((tutor) => {

      let score = 0;

      const subjects =
        Array.isArray(tutor.subjects)
          ? tutor.subjects.map(normalize)
          : [];

      const topics =
        Array.isArray(tutor.topics)
          ? tutor.topics.map(normalize)
          : [];

      const skills =
        Array.isArray(tutor.skills)
          ? tutor.skills.map(normalize)
          : [];


      // ==================================================
      // 1. SUBJECT MATCH — REQUIRED
      // ==================================================

      const subjectMatch =
        subjects.some((item) =>
          textMatches(
            item,
            normalizedSubject
          )
        );

      if (!subjectMatch) {
        return null;
      }

      // Mandatory subject match
      score += 50;


      // ==================================================
      // 2. TOPIC MATCH
      // ==================================================

      const topicMatch =
        Boolean(
          normalizedTopic &&
          topics.some((item) =>
            textMatches(
              item,
              normalizedTopic
            )
          )
        );

      if (topicMatch) {
        score += 30;
      }


      // ==================================================
      // 3. TAG / SKILL MATCH
      // ==================================================

      let matchedTags = 0;

      for (const tag of normalizedTags) {

        const tagMatched =
          skills.some((skill) =>
            textMatches(
              skill,
              tag
            )
          ) ||
          topics.some((topicItem) =>
            textMatches(
              topicItem,
              tag
            )
          );

        if (tagMatched) {
          matchedTags++;
          score += 5;
        }
      }


      // ==================================================
      // 4. RATING BONUS
      // ==================================================

      const rating =
        Number(tutor.rating || 0);

      const ratingBonus =
        Math.min(
          rating * 2,
          10
        );

      score += ratingBonus;


      // ==================================================
      // 5. EXPERIENCE BONUS
      // ==================================================

      const sessions =
        Number(
          tutor.sessionsCompleted || 0
        );

      const experienceBonus =
        Math.min(
          sessions * 0.5,
          10
        );

      score += experienceBonus;


      // ==================================================
      // RETURN MATCH
      // ==================================================

      return {
        ...tutor,

        matchScore:
          Math.round(score),

        matchDetails: {
          subjectMatch: true,

          topicMatch,

          matchedTags,

          rating,

          sessionsCompleted:
            sessions,

          ratingBonus,

          experienceBonus,
        },
      };
    })
    .filter(Boolean);


  // ==================================================
  // SORT
  // ==================================================

  return scored
    .sort((a, b) => {

      // Primary: match score
      if (
        b.matchScore !==
        a.matchScore
      ) {
        return (
          b.matchScore -
          a.matchScore
        );
      }

      // Secondary: rating
      if (
        b.matchDetails.rating !==
        a.matchDetails.rating
      ) {
        return (
          b.matchDetails.rating -
          a.matchDetails.rating
        );
      }

      // Tertiary: experience
      return (
        b.matchDetails.sessionsCompleted -
        a.matchDetails.sessionsCompleted
      );
    })
    .slice(0, limit);
}