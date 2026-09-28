import express from "express";

import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Doubt from "../models/Doubt.js";
import CreditTransaction from "../models/CreditTransaction.js";

import { protect } from "../middleware/auth.js";


const router = express.Router();


// --------------------------------------------------
// CREATE BOOKING
// --------------------------------------------------

router.post(
  "/",

  protect,

  async (req, res, next) => {

    try {

      const {
        tutorId,
        doubtId,
        date,
        startTime,
        endTime,
        meetingLink = "",
        creditsUsed = 10
      } = req.body;


      if (
        !tutorId ||
        !doubtId ||
        !date ||
        !startTime ||
        !endTime
      ) {

        return res.status(400).json({

          message:
            "tutorId, doubtId, date, startTime and endTime are required"

        });

      }


      if (
        req.user.role !== "student"
      ) {

        return res.status(403).json({

          message:
            "Only students can book sessions"

        });

      }


      const tutor =
        await User.findOne({

          _id:
            tutorId,

          role:
            "tutor",

          isActive:
            true

        });


      const doubt =
        await Doubt.findOne({

          _id:
            doubtId,

          studentId:
            req.user._id

        });


      if (!tutor || !doubt) {

        return res.status(404).json({

          message:
            "Tutor or doubt not found"

        });

      }


      if (
        req.user.credits <
        creditsUsed
      ) {

        return res.status(400).json({

          message:
            "Insufficient credits"

        });

      }


      const booking =
        await Booking.create({

          studentId:
            req.user._id,

          tutorId,

          doubtId,

          date,

          startTime,

          endTime,

          meetingLink,

          status:
            "confirmed",

          creditsUsed

        });


      // Deduct credits
      await User.findByIdAndUpdate(

        req.user._id,

        {
          $inc: {
            credits:
              -creditsUsed
          }
        }

      );


      // Credit transaction
      await CreditTransaction.create({

        userId:
          req.user._id,

        amount:
          -creditsUsed,

        type:
          "spent",

        reason:
          "Tutor session booking",

        bookingId:
          booking._id

      });


      // Update doubt
      doubt.status =
        "booked";

      doubt.selectedTutorId =
        tutorId;


      await doubt.save();


      res.status(201).json({

        message:
          "Booking created",

        booking

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// MY BOOKINGS
// --------------------------------------------------

router.get(
  "/my",

  protect,

  async (req, res, next) => {

    try {

      const key =
        req.user.role === "tutor"
          ? "tutorId"
          : "studentId";


      const bookings =
        await Booking

          .find({
            [key]:
              req.user._id
          })

          .populate(
            "studentId tutorId",
            "name email"
          )

          .populate(
            "doubtId",
            "question subject topic"
          )

          .sort("-date");


      res.json({
        bookings
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// GET BOOKING
// --------------------------------------------------

router.get(
  "/:id",

  protect,

  async (req, res, next) => {

    try {

      const booking =
        await Booking

          .findById(
            req.params.id
          )

          .populate(
            "studentId tutorId",
            "name email"
          )

          .populate(
            "doubtId"
          );


      if (!booking) {

        return res.status(404).json({

          message:
            "Booking not found"

        });

      }


      const allowed =
        [
          String(
            booking.studentId._id
          ),

          String(
            booking.tutorId._id
          )
        ].includes(
          String(req.user._id)
        );


      if (
        !allowed &&
        req.user.role !== "admin"
      ) {

        return res.status(403).json({

          message:
            "Access denied"

        });

      }


      res.json({
        booking
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// CANCEL BOOKING
// --------------------------------------------------

router.put(
  "/:id/cancel",

  protect,

  async (req, res, next) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );


      if (!booking) {

        return res.status(404).json({

          message:
            "Booking not found"

        });

      }


      const allowed =
        [
          String(booking.studentId),
          String(booking.tutorId)
        ].includes(
          String(req.user._id)
        );


      if (!allowed) {

        return res.status(403).json({

          message:
            "Access denied"

        });

      }


      if (
        booking.status ===
        "completed"
      ) {

        return res.status(400).json({

          message:
            "Completed booking cannot be cancelled"

        });

      }


      if (
        booking.status ===
        "cancelled"
      ) {

        return res.status(400).json({

          message:
            "Booking is already cancelled"

        });

      }


      booking.status =
        "cancelled";


      await booking.save();


      // Refund
      if (booking.creditsUsed > 0) {

        await User.findByIdAndUpdate(

          booking.studentId,

          {
            $inc: {
              credits:
                booking.creditsUsed
            }
          }

        );


        await CreditTransaction.create({

          userId:
            booking.studentId,

          amount:
            booking.creditsUsed,

          type:
            "refund",

          reason:
            "Cancelled booking",

          bookingId:
            booking._id

        });

      }


      res.json({

        message:
          "Booking cancelled",

        booking

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// COMPLETE BOOKING
// --------------------------------------------------

router.put(
  "/:id/complete",

  protect,

  async (req, res, next) => {

    try {

      const booking =
        await Booking.findById(
          req.params.id
        );


      if (!booking) {

        return res.status(404).json({

          message:
            "Booking not found"

        });

      }


      const allowed =
        [
          String(booking.studentId),
          String(booking.tutorId)
        ].includes(
          String(req.user._id)
        );


      if (!allowed) {

        return res.status(403).json({

          message:
            "Access denied"

        });

      }


      booking.status =
        "completed";


      booking.sessionNotes =
        req.body.sessionNotes ||
        booking.sessionNotes;


      await booking.save();


      res.json({

        message:
          "Booking completed",

        booking

      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;