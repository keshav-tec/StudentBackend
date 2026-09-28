import express from "express";

import Notification
  from "../models/Notification.js";

import { protect }
  from "../middleware/auth.js";


const router = express.Router();


// --------------------------------------------------
// GET NOTIFICATIONS
// --------------------------------------------------

router.get(
  "/",

  protect,

  async (req, res, next) => {

    try {

      const notifications =
        await Notification

          .find({
            userId:
              req.user._id
          })

          .sort("-createdAt");


      res.json({
        notifications
      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// MARK ONE AS READ
// --------------------------------------------------

router.patch(
  "/:id/read",

  protect,

  async (req, res, next) => {

    try {

      const notification =
        await Notification.findOneAndUpdate(

          {
            _id:
              req.params.id,

            userId:
              req.user._id
          },

          {
            $set: {
              isRead:
                true
            }
          },

          {
            new: true
          }

        );


      if (!notification) {

        return res.status(404).json({

          message:
            "Notification not found"

        });

      }


      res.json({

        notification

      });

    }

    catch (error) {

      next(error);

    }

  }
);


// --------------------------------------------------
// MARK ALL AS READ
// --------------------------------------------------

router.patch(
  "/read-all",

  protect,

  async (req, res, next) => {

    try {

      await Notification.updateMany(

        {
          userId:
            req.user._id,

          isRead:
            false
        },

        {
          $set: {
            isRead:
              true
          }
        }

      );


      res.json({

        message:
          "All notifications marked as read"

      });

    }

    catch (error) {

      next(error);

    }

  }
);


export default router;