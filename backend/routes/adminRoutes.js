import express from "express";

import User from "../models/User.js";
import Doubt from "../models/Doubt.js";
import Solution from "../models/Solution.js";
import Booking from "../models/Booking.js";
import Rating from "../models/Rating.js";

import {
  protect,
  allow
} from "../middleware/auth.js";


const router = express.Router();


// --------------------------------------------------
// ADMIN AUTHENTICATION
// --------------------------------------------------

router.use(
  protect,
  allow("admin")
);


// --------------------------------------------------
// OVERVIEW
// --------------------------------------------------

router.get(
  "/overview",

  async (req, res, next) => {

    try {

      const [
        users,
        doubts,
        solutions,
        bookings,
        ratings
      ] = await Promise.all([

        User.countDocuments(),

        Doubt.countDocuments(),

        Solution.countDocuments(),

        Booking.countDocuments(),

        Rating.countDocuments()

      ]);


      res.json({

        users,

        doubts,

        solutions,

        bookings,

        ratings

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// GENERIC LIST HELPER
// --------------------------------------------------

const list =
  (Model, populate) =>
  async (req, res, next) => {

    try {

      let query =
        Model
          .find()
          .sort("-createdAt")
          .limit(
            Number(req.query.limit) || 100
          );


      if (populate) {

        query =
          query.populate(populate);

      }


      res.json({

        data:
          await query

      });

    }

    catch (error) {

      next(error);

    }

  };


// --------------------------------------------------
// MONITOR USERS
// --------------------------------------------------

router.get(
  "/users",
  list(User)
);


// --------------------------------------------------
// MONITOR DOUBTS
// --------------------------------------------------

router.get(
  "/doubts",

  list(

    Doubt,

    [
      {
        path: "studentId",
        select: "name email"
      },

      {
        path: "selectedTutorId",
        select: "name email"
      }
    ]

  )
);


// --------------------------------------------------
// MONITOR SOLUTIONS
// --------------------------------------------------

router.get(
  "/solutions",

  list(

    Solution,

    [
      {
        path: "tutorId",
        select: "name email"
      }
    ]

  )
);


// --------------------------------------------------
// MONITOR BOOKINGS
// --------------------------------------------------

router.get(
  "/bookings",

  list(

    Booking,

    [
      {
        path: "studentId",
        select: "name email"
      },

      {
        path: "tutorId",
        select: "name email"
      }
    ]

  )
);


// --------------------------------------------------
// MONITOR TUTORS
// --------------------------------------------------

router.get(
  "/tutors",

  async (req, res, next) => {

    try {

      const tutors =
        await User

          .find({
            role:
              "tutor"
          })

          .select("-password")

          .sort("-createdAt");


      res.json({
        data:
          tutors
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// MONITOR RATINGS
// --------------------------------------------------

router.get(
  "/ratings",

  list(

    Rating,

    [
      {
        path: "studentId",
        select: "name"
      },

      {
        path: "tutorId",
        select: "name"
      }
    ]

  )
);


// --------------------------------------------------
// SUBJECT ANALYTICS
// --------------------------------------------------

router.get(
  "/analytics/subjects",

  async (req, res, next) => {

    try {

      const data =
        await Doubt.aggregate([

          {
            $group: {

              _id:
                "$subject",

              count: {
                $sum:
                  1
              }

            }

          },

          {
            $sort: {
              count:
                -1
            }
          }

        ]);


      res.json({
        data
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// AI ANALYTICS
// --------------------------------------------------

router.get(
  "/analytics/ai",

  async (req, res, next) => {

    try {

      const data =
        await Doubt.aggregate([

          {
            $group: {

              _id:
                "$aiAnalysis.isValidAcademicQuestion",

              count: {
                $sum:
                  1
              }

            }

          }

        ]);


      res.json({
        data
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// VOICE ANALYTICS
// --------------------------------------------------

router.get(
  "/analytics/voice",

  async (req, res, next) => {

    try {

      const data =
        await Doubt.aggregate([

          {
            $group: {

              _id:
                "$inputType",

              count: {
                $sum:
                  1
              }

            }

          }

        ]);


      res.json({
        data
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// PLATFORM ACTIVITY
// --------------------------------------------------

router.get(
  "/analytics/activity",

  async (req, res, next) => {

    try {

      const data =
        await Doubt.aggregate([

          {
            $group: {

              _id: {

                $dateToString: {

                  format:
                    "%Y-%m-%d",

                  date:
                    "$createdAt"

                }

              },

              count: {
                $sum:
                  1
              }

            }

          },

          {
            $sort: {
              _id:
                1
            }
          }

        ]);


      res.json({
        data
      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;