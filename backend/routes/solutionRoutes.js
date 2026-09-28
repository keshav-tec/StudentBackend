import express from "express";

import Solution from "../models/Solution.js";
import Doubt from "../models/Doubt.js";

import {
  protect,
  allow
} from "../middleware/auth.js";


const router = express.Router();


// --------------------------------------------------
// SUBMIT SOLUTION
// --------------------------------------------------

router.post(
  "/",

  protect,

  allow("tutor"),

  async (req, res, next) => {

    try {

      const {
        doubtId,
        solutionText,
        attachments = [],
        solutionType = "text"
      } = req.body;


      if (
        !doubtId ||
        !solutionText
      ) {

        return res.status(400).json({

          message:
            "doubtId and solutionText are required"

        });

      }


      const doubt =
        await Doubt.findById(
          doubtId
        );


      if (!doubt) {

        return res.status(404).json({

          message:
            "Doubt not found"

        });

      }


      const solution =
        await Solution.create({

          doubtId,

          tutorId:
            req.user._id,

          solutionText,

          attachments,

          solutionType

        });


      doubt.status =
        "resolved";

      doubt.selectedTutorId =
        req.user._id;

      doubt.resolvedAt =
        new Date();


      await doubt.save();


      res.status(201).json({

        message:
          "Solution submitted",

        solution

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// GET SOLUTIONS FOR DOUBT
// --------------------------------------------------

router.get(
  "/doubt/:doubtId",

  protect,

  async (req, res, next) => {

    try {

      const solutions =
        await Solution

          .find({
            doubtId:
              req.params.doubtId
          })

          .populate(
            "tutorId",
            "name profileImage"
          );


      res.json({
        solutions
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// GET SINGLE SOLUTION
// --------------------------------------------------

router.get(
  "/:id",

  protect,

  async (req, res, next) => {

    try {

      const solution =
        await Solution

          .findById(
            req.params.id
          )

          .populate(
            "tutorId",
            "name profileImage"
          );


      if (!solution) {

        return res.status(404).json({

          message:
            "Solution not found"

        });

      }


      solution.studentViewed =
        true;

      solution.viewedAt =
        new Date();


      await solution.save();


      res.json({
        solution
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// UPDATE SOLUTION
// --------------------------------------------------

router.put(
  "/:id",

  protect,

  allow("tutor"),

  async (req, res, next) => {

    try {

      const allowedFields = [

        "solutionText",
        "attachments",
        "solutionType"

      ];


      const updateData =
        Object.fromEntries(

          Object.entries(
            req.body
          ).filter(
            ([key]) =>
              allowedFields.includes(key)
          )

        );


      const solution =
        await Solution.findOneAndUpdate(

          {
            _id:
              req.params.id,

            tutorId:
              req.user._id
          },

          {
            $set:
              updateData
          },

          {
            new: true
          }

        );


      if (!solution) {

        return res.status(404).json({

          message:
            "Solution not found"

        });

      }


      res.json({
        solution
      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;