import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Doubt from "../models/Doubt.js";

import {
  protect,
  allow
} from "../middleware/auth.js";

import {
  transcribeAudio
} from "../services/sarvamService.js";

import {
  tagQuestion
} from "../services/questionTagger.js";

import {
  findTutorMatches
} from "../services/tutorMatching.js";


const router = express.Router();


// --------------------------------------------------
// UPLOAD CONFIGURATION
// --------------------------------------------------

const uploadDir =
  path.resolve("uploads");


fs.mkdirSync(
  uploadDir,
  {
    recursive: true
  }
);


const storage =
  multer.diskStorage({

    destination: uploadDir,

    filename: (
      req,
      file,
      callback
    ) => {

      callback(
        null,

        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(
          file.originalname
        )}`
      );

    }

  });


const audio = multer({

  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  }

});


// --------------------------------------------------
// TEXT DOUBT
// --------------------------------------------------

router.post(
  "/text",

  protect,

  allow("student"),

  async (req, res, next) => {

    try {

      const {
        question
      } = req.body;


      if (!question?.trim()) {

        return res.status(400).json({

          message:
            "question is required"

        });

      }


      // AI TAGGING
      const analysis = await tagQuestion(question);


      // CREATE DOUBT
      const doubt =
        await Doubt.create({

          studentId:
            req.user._id,

          inputType:
            "text",

          question,

          subject:
            analysis.subject,

          topic:
            analysis.topic,

          difficulty:
            analysis.difficulty,

          tags:
            analysis.tags,

          aiAnalysis: {

            isValidAcademicQuestion:
              analysis.isValidAcademicQuestion,

            category:
              analysis.category,

            subTopic:
              analysis.subTopic,

            confidence:
              analysis.confidence,

            explanation:
              analysis.explanation,

            processedAt:
              new Date()

          },

          status:
            analysis.isValidAcademicQuestion
              ? "validated"
              : "rejected"

        });


      // MATCH TUTORS
      const matches =
        analysis.isValidAcademicQuestion
          ? await findTutorMatches(doubt)
          : [];


      res.status(201).json({

        message:
          "Doubt submitted",

        doubt,

        matches

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// VOICE DOUBT
// --------------------------------------------------

router.post(
  "/voice",

  protect,
  allow("student"),
  audio.single("audio"),

  async (req, res, next) => {
    let doubt;

    try {
      console.log("\n========== VOICE UPLOAD DEBUG ==========");
      console.log(
        "Content-Type:",
        req.headers["content-type"]
      );

      console.log("req.file:", req.file);

      console.log("req.body:", req.body);

      if (req.file) {
        console.log("File field:", req.file.fieldname);
        console.log("Original name:", req.file.originalname);
        console.log("MIME type:", req.file.mimetype);
        console.log("Size:", req.file.size);
        console.log("Saved path:", req.file.path);
      }

      console.log("========================================\n");

      if (!req.file) {
        return res.status(400).json({
          message: "audio file is required",
        });
      }

      // rest of your code...


      // Create initial record
      doubt =
        await Doubt.create({

          studentId:
            req.user._id,

          inputType:
            "voice",

          question:
            "",

          audioUrl:
            `/uploads/${req.file.filename}`,

          status:
            "transcribing"

        });


      // SARVAM STT
      const stt =
        await transcribeAudio(
          req.file.path,
          {
            mode:
              req.body.mode ||
              "transcribe"
          }
        );


      const transcript =
        stt.transcript?.trim();


      if (!transcript) {

        throw new Error(
          "No speech was detected"
        );

      }


      // AI TAGGING
      const analysis = await tagQuestion(transcript);


      // Update doubt
      doubt.question =
        transcript;


      doubt.speechToText = {

        transcript,

        languageCode:
          stt.language_code,

        model:
          process.env.SARVAM_STT_MODEL ||
          "saaras:v4",

        requestId:
          stt.request_id,

        processedAt:
          new Date()

      };


      doubt.subject =
        analysis.subject;

      doubt.topic =
        analysis.topic;

      doubt.difficulty =
        analysis.difficulty;

      doubt.tags =
        analysis.tags;


      doubt.aiAnalysis = {

        isValidAcademicQuestion:
          analysis.isValidAcademicQuestion,

        category:
          analysis.category,

        subTopic:
          analysis.subTopic,

        confidence:
          analysis.confidence,

        explanation:
          analysis.explanation,

        processedAt:
          new Date()

      };


      doubt.status =
        analysis.isValidAcademicQuestion
          ? "validated"
          : "rejected";


      await doubt.save();


      // Tutor matching
      const matches =
        analysis.isValidAcademicQuestion
          ? await findTutorMatches(doubt)
          : [];


      res.status(201).json({

        message:
          "Voice doubt submitted",

        doubt,

        matches

      });

    }

    catch (error) {

      if (doubt) {

        doubt.status =
          "rejected";

        await doubt.save()
          .catch(() => {});

      }

      next(error);

    }

  }
);


// --------------------------------------------------
// GET MY DOUBTS
// --------------------------------------------------

router.get(
  "/",
  protect,

  async (req, res, next) => {

    try {

      const filter =
        req.user.role === "student"

          ? {
              studentId:
                req.user._id
            }

          : {};


      if (req.query.subject) {

        filter.subject =
          req.query.subject;

      }


      const doubts =
        await Doubt
          .find(filter)

          .populate(
            "studentId",
            "name"
          )

          .populate(
            "selectedTutorId",
            "name"
          )

          .sort("-createdAt");


      res.json({

        count:
          doubts.length,

        doubts

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// GET TUTOR MATCHES
// --------------------------------------------------

router.get(
  "/matches/:id",

  protect,

  async (req, res, next) => {

    try {

      const doubt =
        await Doubt.findById(
          req.params.id
        );


      if (!doubt) {

        return res.status(404).json({

          message:
            "Doubt not found"

        });

      }


      const matches =
        await findTutorMatches(
          doubt
        );


      res.json({
        matches
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// GET SINGLE DOUBT
// --------------------------------------------------

router.get(
  "/:id",

  protect,

  async (req, res, next) => {

    try {

      const doubt =
        await Doubt

          .findById(
            req.params.id
          )

          .populate(
            "studentId",
            "name email"
          )

          .populate(
            "selectedTutorId",
            "name email"
          );


      if (!doubt) {

        return res.status(404).json({

          message:
            "Doubt not found"

        });

      }


      // Students can only view their own doubts
      if (
        req.user.role === "student" &&
        String(doubt.studentId._id) !==
          String(req.user._id)
      ) {

        return res.status(403).json({

          message:
            "Access denied"

        });

      }


      res.json({
        doubt
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// DELETE DOUBT
// --------------------------------------------------

router.delete(
  "/:id",

  protect,

  allow("student"),

  async (req, res, next) => {

    try {

      const doubt =
        await Doubt.findOneAndDelete({

          _id:
            req.params.id,

          studentId:
            req.user._id

        });


      if (!doubt) {

        return res.status(404).json({

          message:
            "Doubt not found"

        });

      }


      res.json({

        message:
          "Doubt deleted"

      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;