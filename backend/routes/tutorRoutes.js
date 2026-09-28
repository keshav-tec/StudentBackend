import express from "express";

import TutorProfile from "../models/TutorProfile.js";
import Doubt from "../models/Doubt.js";

import {
  protect,
  allow,
} from "../middleware/auth.js";

import {
  findTutorMatches,
} from "../services/tutorMatching.js";

const router = express.Router();


// ==================================================
// GET ALL TUTORS
// ==================================================

router.get(
  "/",
  async (req, res, next) => {
    try {
      const query = {};

      // --------------------------------------------
      // OPTIONAL SUBJECT FILTER
      // --------------------------------------------

      if (req.query.subject?.trim()) {
        query.subjects = {
          $regex: req.query.subject.trim(),
          $options: "i",
        };
      }

      const profiles = await TutorProfile
        .find(query)
        .populate(
          "userId",
          "name email profileImage college department year"
        )
        .sort({
          rating: -1,
          sessionsCompleted: -1,
        });

      res.json({
        count: profiles.length,
        tutors: profiles,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/me",
  protect,
  allow("tutor"),
  async (req, res, next) => {
    try {
      const profile = await TutorProfile.findOne({
        userId: req.user._id,
      }).populate(
        "userId",
        "name email profileImage college department year"
      );

      if (!profile) {
        return res.status(404).json({
          message: "Tutor profile not found",
        });
      }

      res.json({
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
);


// ==================================================
// MATCH TUTORS TO DOUBT
// ==================================================

router.get(
  "/matches/:doubtId",
  protect,
  async (req, res, next) => {
    try {
      const doubt = await Doubt.findById(
        req.params.doubtId
      );

      if (!doubt) {
        return res.status(404).json({
          message: "Doubt not found",
        });
      }

      const matches = await findTutorMatches(
        doubt
      );

      res.json({
        count: matches.length,
        matches,
      });
    } catch (error) {
      next(error);
    }
  }
);


// ==================================================
// GET TUTOR PROFILE
// ==================================================

router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const profile = await TutorProfile
        .findOne({
          userId: req.params.id,
        })
        .populate(
          "userId",
          "name email profileImage college department year"
        );

      if (!profile) {
        return res.status(404).json({
          message: "Tutor profile not found",
        });
      }

      res.json({
        tutor: profile,
      });
    } catch (error) {
      next(error);
    }
  }
);


// ==================================================
// UPDATE TUTOR PROFILE
// ==================================================

router.put(
  "/profile",
  protect,
  allow("tutor"),
  async (req, res, next) => {
    try {
      const {
        bio = "",
        subjects = [],
        topics = [],
        skills = [],
      } = req.body;

      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({
          message:
            "Please select at least one mastered subject.",
        });
      }

      if (!Array.isArray(topics)) {
        return res.status(400).json({
          message: "topics must be an array.",
        });
      }

      if (!Array.isArray(skills)) {
        return res.status(400).json({
          message: "skills must be an array.",
        });
      }

      const profile =
        await TutorProfile.findOneAndUpdate(
          {
            userId: req.user._id,
          },
          {
            $set: {
              bio,
              subjects,
              topics,
              skills,
            },
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      res.json({
        message: "Tutor profile updated successfully",
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
);


// ==================================================
// UPDATE AVAILABILITY
// ==================================================

router.put(
  "/availability",
  protect,
  allow("tutor"),
  async (req, res, next) => {
    try {
      if (
        !Array.isArray(
          req.body.availability
        )
      ) {
        return res.status(400).json({
          message:
            "availability must be an array",
        });
      }

      const profile =
        await TutorProfile.findOneAndUpdate(
          {
            userId: req.user._id,
          },
          {
            $set: {
              availability:
                req.body.availability,
            },
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
          }
        );

      res.json({
        availability:
          profile.availability,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/me",
  protect,
  allow("tutor"),
  async (req, res, next) => {
    try {
      const profile = await TutorProfile.findOne({
        userId: req.user._id,
      }).populate(
        "userId",
        "name email profileImage college department year"
      );

      if (!profile) {
        return res.status(404).json({
          message: "Tutor profile not found",
        });
      }

      res.json({
        profile,
      });
    } catch (error) {
      next(error);
    }
  }
);


export default router;