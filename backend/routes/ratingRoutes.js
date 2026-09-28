import express from "express";

import Rating from "../models/Rating.js";
import Booking from "../models/Booking.js";
import TutorProfile from "../models/TutorProfile.js";

import {
  protect,
  allow
} from "../middleware/auth.js";


const router = express.Router();


// --------------------------------------------------
// CREATE RATING
// --------------------------------------------------

router.post(
  "/",

  protect,

  allow("student"),

  async (req, res, next) => {

    try {

      const {
        bookingId,
        rating,
        review = ""
      } = req.body;


      const booking =
        await Booking.findOne({

          _id:
            bookingId,

          studentId:
            req.user._id,

          status:
            "completed"

        });


      if (!booking) {

        return res.status(400).json({

          message:
            "Completed booking not found"

        });

      }


      const newRating =
        await Rating.create({

          bookingId,

          studentId:
            req.user._id,

          tutorId:
            booking.tutorId,

          rating,

          review

        });


      const stats =
        await Rating.aggregate([

          {
            $match: {
              tutorId:
                booking.tutorId
            }
          },

          {
            $group: {

              _id:
                null,

              avg: {
                $avg:
                  "$rating"
              },

              count: {
                $sum:
                  1
              }

            }
          }

        ]);


      await TutorProfile.findOneAndUpdate(

        {
          userId:
            booking.tutorId
        },

        {

          $set: {

            rating:
              stats[0]?.avg || 0,

            totalRatings:
              stats[0]?.count || 0

          },

          $inc: {

            sessionsCompleted:
              1

          }

        }

      );


      res.status(201).json({

        message:
          "Rating submitted",

        rating:
          newRating

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// GET TUTOR RATINGS
// --------------------------------------------------

router.get(
  "/tutor/:tutorId",

  async (req, res, next) => {

    try {

      const ratings =
        await Rating

          .find({
            tutorId:
              req.params.tutorId
          })

          .populate(
            "studentId",
            "name profileImage"
          )

          .sort("-createdAt");


      res.json({
        ratings
      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;